/*
  Copyright 2021 Kidus Tiliksew

  This file is part of Tensor EMR.

  Tensor EMR is free software: you can redistribute it and/or modify
  it under the terms of the version 2 of GNU General Public License as published by
  the Free Software Foundation.

  Tensor EMR is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

package service

import (
	"context"
	"fmt"
	"os"

	"github.com/RediSearch/redisearch-go/redisearch"
	"github.com/go-redis/redis/v8"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j/dbtype"
	pb "github.com/tensorsystems/tensoremr/libs/proto/pkg/terminology"
)

type ApiService struct {
	NeoSession neo4j.Session
	Redis      *redis.Client
	pb.UnimplementedTerminologyServer
}

func (s *ApiService) Search(ctx context.Context, in *pb.SearchRequest) (*pb.ConceptsResponse, error) {
	index := ""
	if in.Type == pb.SearchType_HISTORY_OF_DISORDER {
		index = INDEX_HISTORY_OF_DISORDER
	} else if in.Type == pb.SearchType_FAMILY_HISTORY {
		index = INDEX_FAMILY_HISTORY
	} else if in.Type == pb.SearchType_SOCIAL_HISTORY {
		index = INDEX_SOCIAL_HISTORY
	} else if in.Type == pb.SearchType_PROCEDURE {
		index = INDEX_PROCEDURE
	} else if in.Type == pb.SearchType_LIFESTYLE {
		index = INDEX_LIFESTYLE
	} else if in.Type == pb.SearchType_ADMINISTRATIVE_STATUS {
		index = INDEX_ADMINISTRATIVE_STATUS
	} else if in.Type == pb.SearchType_MENTAL_STATE {
		index = INDEX_MENTAL_STATE
	} else if in.Type == pb.SearchType_IMMUNIZATION {
		index = INDEX_IMMUNIZATION
	} else if in.Type == pb.SearchType_ALLERGIC_CONDITION {
		index = INDEX_ALLERGIC_CONDITION
	} else if in.Type == pb.SearchType_INTOLERANCE {
		index = INDEX_INTOLERANCE
	} 

	c := redisearch.NewClient(os.Getenv("REDIS_ADDRESS"), index)

	search := in.Term + "*"

	docs, total, err := c.Search(redisearch.NewQuery(search).Limit(0, int(in.GetSize())))

	if err != nil {
		return nil, err
	}

	var items []*pb.Concept

	for _, doc := range docs {
		var item pb.Concept
		item.Id = doc.Properties["sctid"].(string)
		item.CaseSignificanceId = doc.Properties["caseSignificanceId"].(string)
		item.Nodetype = doc.Properties["nodetype"].(string)
		item.AcceptabilityId = doc.Properties["acceptabilityId"].(string)
		item.RefsetId = doc.Properties["refsetId"].(string)
		item.LanguageCode = doc.Properties["languageCode"].(string)
		item.DescriptionType = doc.Properties["descriptionType"].(string)
		item.Term = doc.Properties["term"].(string)
		item.TypeId = doc.Properties["typeId"].(string)
		item.ModuleId = doc.Properties["moduleId"].(string)
		item.Sctid = doc.Properties["sctid"].(string)

		items = append(items, &item)
	}

	var response pb.ConceptsResponse
	response.Items = items
	response.Total = int64(total)

	return &response, err
}

func (s *ApiService) GetConceptAttributes(ctx context.Context, in *pb.ConceptAttributesRequest) (*pb.ConceptAttributeResponse, error) {
	type ConceptAttribute struct {
		Association  dbtype.Node
		Relationship dbtype.Relationship
		Description  dbtype.Node
	}

	results, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []ConceptAttribute

		result, err := tx.Run(fmt.Sprintf("MATCH (n:ObjectConcept{sctid: '%s'})-[:HAS_ROLE_GROUP]->(roles)-[rel]->(association)-[:HAS_DESCRIPTION]->(description) WHERE rel.active = '1' AND association.active = '1' AND description.descriptionType = 'Preferred' AND description.active = '1' RETURN association, rel, description", in.ConceptId), nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, ConceptAttribute{
				Association:  result.Record().Values[0].(dbtype.Node),
				Relationship: result.Record().Values[1].(dbtype.Relationship),
				Description:  result.Record().Values[2].(dbtype.Node),
			})
		}

		if err = result.Err(); err != nil {
			return nil, err
		}

		return list, nil
	})

	items := results.([]ConceptAttribute)

	if err != nil {
		return nil, err
	}

	var conceptAttributes []*pb.ConceptAttributes

	for _, item := range items {
		var association pb.Concept
		association.Id = item.Association.Props["sctid"].(string)
		association.Nodetype = item.Association.Props["nodetype"].(string)
		association.FSN = item.Association.Props["FSN"].(string)
		association.ModuleId = item.Association.Props["moduleId"].(string)
		association.Sctid = item.Association.Props["sctid"].(string)

		var description pb.Concept
		description.Id = item.Description.Props["sctid"].(string)
		description.CaseSignificanceId = item.Description.Props["caseSignificanceId"].(string)
		description.Nodetype = item.Description.Props["nodetype"].(string)
		description.AcceptabilityId = item.Description.Props["acceptabilityId"].(string)
		description.RefsetId = item.Description.Props["refsetId"].(string)
		description.LanguageCode = item.Description.Props["languageCode"].(string)
		description.DescriptionType = item.Description.Props["descriptionType"].(string)
		description.Term = item.Description.Props["term"].(string)
		description.TypeId = item.Description.Props["typeId"].(string)
		description.ModuleId = item.Description.Props["moduleId"].(string)
		description.Sctid = item.Description.Props["sctid"].(string)

		var attribute pb.ConceptAttributes
		attribute.Association = &association
		attribute.RelationshipId = item.Relationship.Props["sctid"].(string)
		attribute.RelationshipType = item.Relationship.Type
		attribute.RelationshipTypeId = item.Relationship.Props["typeId"].(string)
		attribute.Description = &description

		conceptAttributes = append(conceptAttributes, &attribute)
	}

	var response pb.ConceptAttributeResponse
	response.Attributes = conceptAttributes

	return &response, err
}

func (s *ApiService) GetConceptChildren(ctx context.Context, in *pb.ConceptChildrenRequest) (*pb.ConceptChildrenResponse, error) {
	type ConceptChildren struct {
		Child       dbtype.Node
		Description dbtype.Node
		Count       int64
	}

	results, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []ConceptChildren

		result, err := tx.Run(fmt.Sprintf("MATCH (n:ObjectConcept {sctid: '%s', active: '1'})<-[:ISA]-(child {active: '1'})-[:HAS_DESCRIPTION]->(description: Description {descriptionType: 'Preferred'}), (child)<-[:ISA*0..1]-(c:ObjectConcept{active:'1'}) RETURN child, description, count(c) as count ORDER BY description.term", in.ConceptId), nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, ConceptChildren{
				Child:       result.Record().Values[0].(dbtype.Node),
				Description: result.Record().Values[1].(dbtype.Node),
				Count:       result.Record().Values[2].(int64),
			})
		}

		if err = result.Err(); err != nil {
			return nil, err
		}

		return list, nil
	})

	items := results.([]ConceptChildren)

	if err != nil {
		return nil, err
	}

	var conceptChildren []*pb.ConceptChildren

	for _, item := range items {
		var child pb.Concept
		child.Id = item.Child.Props["sctid"].(string)
		child.Nodetype = item.Child.Props["nodetype"].(string)
		child.FSN = item.Child.Props["FSN"].(string)
		child.ModuleId = item.Child.Props["moduleId"].(string)
		child.Sctid = item.Child.Props["sctid"].(string)

		var description pb.Concept
		description.Id = item.Description.Props["sctid"].(string)
		description.CaseSignificanceId = item.Description.Props["caseSignificanceId"].(string)
		description.Nodetype = item.Description.Props["nodetype"].(string)
		description.AcceptabilityId = item.Description.Props["acceptabilityId"].(string)
		description.RefsetId = item.Description.Props["refsetId"].(string)
		description.LanguageCode = item.Description.Props["languageCode"].(string)
		description.DescriptionType = item.Description.Props["descriptionType"].(string)
		description.Term = item.Description.Props["term"].(string)
		description.TypeId = item.Description.Props["typeId"].(string)
		description.ModuleId = item.Description.Props["moduleId"].(string)
		description.Sctid = item.Description.Props["sctid"].(string)

		var conceptChild pb.ConceptChildren
		conceptChild.Child = &child
		conceptChild.Description = &description
		conceptChild.Count = item.Count

		conceptChildren = append(conceptChildren, &conceptChild)
	}

	var response pb.ConceptChildrenResponse
	response.Children = conceptChildren

	return &response, err
}
