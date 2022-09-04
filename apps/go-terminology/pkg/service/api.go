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

func (s *ApiService) GetHistoryOfDisorders(ctx context.Context, in *pb.LookupRequest) (*pb.SnomedCtResponse, error) {
	c := redisearch.NewClient(os.Getenv("REDIS_ADDRESS"), "history-of-disorder")

	// sp := strings.Split(in.SearchTerm, " ")

	search := "History of " + in.SearchTerm + "*"

	docs, total, err := c.Search(redisearch.NewQuery(search).Limit(0, int(in.GetSize())))

	if err != nil {
		return nil, err
	}

	var items []*pb.SnomedCT

	for _, doc := range docs {
		var item pb.SnomedCT
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

	var response pb.SnomedCtResponse
	response.Items = items
	response.Total = int64(total)

	return &response, err
}



func (s *ApiService) GetConceptAttributes() (*pb.SnomedCtResponse, error) {
	type ConceptAttribute struct {
		Attribute    dbtype.Node
		Relationship dbtype.Relationship
		Description  dbtype.Node
	}

	results, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []ConceptAttribute

		result, err := tx.Run("MATCH (n:ObjectConcept{sctid: '161501007'})-[:HAS_ROLE_GROUP]->(roles)-[rel]->(association)-[:HAS_DESCRIPTION]->(description) WHERE rel.active = '1' AND association.active = '1' AND description.descriptionType = 'Preferred' AND description.active = '1' RETURN association, rel, description", nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, ConceptAttribute{
				Attribute:    result.Record().Values[0].(dbtype.Node),
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

	fmt.Print(items[0].Relationship.StartId)

	if err != nil {
		return nil, err
	}

	return nil, err
}
