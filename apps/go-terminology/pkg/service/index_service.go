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
	"fmt"
	"os"
	"strconv"

	"github.com/RediSearch/redisearch-go/redisearch"
	"github.com/go-redis/redis/v8"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j/dbtype"
)

type IndexService struct {
	NeoSession neo4j.Session
	Redis      *redis.Client
}

const (
	INDEX_HISTORY_OF_DISORDER      = "history-of-disorder"
	INDEX_FAMILY_HISTORY           = "family-history"
	INDEX_PROCEDURE                = "procedure"
	INDEX_SOCIAL_HISTORY           = "social-history"
	INDEX_LIFESTYLE                = "lifestyle"
	INDEX_ADMINISTRATIVE_STATUS    = "administrative-status"
	INDEX_MENTAL_STATE             = "mental-state"
	INDEX_IMMUNIZATION             = "immunization"
	INDEX_ALLERGIC_CONDITION       = "allergic-condition"
	INDEX_INTOLERANCE              = "intolerance"
	INDEX_HOSPITAL_ADMISSION       = "hospital-admission"
	INDEX_HISTORY_CLINICAL_FINDING = "history-clinical-finding"
)

// IndexHistoryOfDisorder ...
func (s *IndexService) IndexHistoryOfDisorder() error {
	result, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []dbtype.Node

		// Past History of Clinical Finding
		result, err := tx.Run("MATCH (n:ObjectConcept {sctid: '312850006', active: '1'})<-[:ISA*1..6]-(children)-[:HAS_DESCRIPTION]->(description: Description) WHERE description.descriptionType <> 'FSN' RETURN description", nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, result.Record().Values[0].(dbtype.Node))
		}

		if err = result.Err(); err != nil {
			return nil, err
		}

		// No History of Clinical Finding
		result, err = tx.Run("MATCH (n:ObjectConcept {sctid: '443508001', active: '1'})<-[:ISA*1..6]-(children)-[:HAS_DESCRIPTION]->(description: Description) WHERE description.descriptionType <> 'FSN' RETURN description", nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, result.Record().Values[0].(dbtype.Node))
		}

		if err = result.Err(); err != nil {
			return nil, err
		}

		return list, nil
	})

	if err != nil {
		return err
	}

	// docs, total, err := c.Search(redisearch.NewQuery("History of hypert*").
	// 	Limit(0, 20))

	// for _, doc := range docs {
	// 	fmt.Println(doc.Id, doc.Properties["term"], total, err)
	// }

	items := result.([]dbtype.Node)
	return s.Index(INDEX_HISTORY_OF_DISORDER, items)
}

// IndexFamilyHistory ...
func (s *IndexService) IndexFamilyHistory() error {
	result, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []dbtype.Node

		// 417662000

		// Positive Findings
		result, err := tx.Run("MATCH (n:ObjectConcept {sctid: '416471007', active: '1'})<-[:ISA*1..6]-(children)-[:HAS_DESCRIPTION]->(description: Description) WHERE description.descriptionType <> 'FSN' RETURN description", nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, result.Record().Values[0].(dbtype.Node))
		}

		if err = result.Err(); err != nil {
			return nil, err
		}

		// Negative findings
		result, err = tx.Run("MATCH (n:ObjectConcept {sctid: '160266009', active: '1'})<-[:ISA*1..6]-(children)-[:HAS_DESCRIPTION]->(description: Description) WHERE description.descriptionType <> 'FSN' RETURN description", nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, result.Record().Values[0].(dbtype.Node))
		}

		if err = result.Err(); err != nil {
			return nil, err
		}

		return list, nil
	})

	if err != nil {
		return err
	}

	items := result.([]dbtype.Node)
	return s.Index(INDEX_FAMILY_HISTORY, items)
}

// IndexProcedures ...
func (s *IndexService) IndexProcedures() error {
	result, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []dbtype.Node

		// Positive Findings
		result, err := tx.Run("MATCH (concept:ObjectConcept {active: '1'})-[:HAS_DESCRIPTION]->(description:Description) WHERE concept.FSN contains '(procedure)' AND description.descriptionType <> 'FSN' RETURN description", nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, result.Record().Values[0].(dbtype.Node))
		}

		if err = result.Err(); err != nil {
			return nil, err
		}

		return list, nil
	})

	if err != nil {
		return err
	}

	items := result.([]dbtype.Node)
	return s.Index(INDEX_PROCEDURE, items)
}

// IndexSocialHistory ...
func (s *IndexService) IndexSocialHistory() error {
	result, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []dbtype.Node

		// Past History of Clinical Finding
		result, err := tx.Run("MATCH (n:ObjectConcept {sctid: '365448001', active: '1'})<-[:ISA*1..6]-(children)-[:HAS_DESCRIPTION]->(description: Description) WHERE description.descriptionType <> 'FSN' RETURN description", nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, result.Record().Values[0].(dbtype.Node))
		}

		if err = result.Err(); err != nil {
			return nil, err
		}

		return list, nil
	})

	if err != nil {
		return err
	}

	items := result.([]dbtype.Node)
	return s.Index(INDEX_SOCIAL_HISTORY, items)
}

// IndexLifestyle ...
func (s *IndexService) IndexLifestyle() error {
	result, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []dbtype.Node

		result, err := tx.Run("MATCH (n:ObjectConcept {sctid: '365949003', active: '1'})<-[:ISA*1..6]-(children)-[:HAS_DESCRIPTION]->(description: Description) WHERE description.descriptionType <> 'FSN' RETURN description", nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, result.Record().Values[0].(dbtype.Node))
		}

		if err = result.Err(); err != nil {
			return nil, err
		}

		return list, nil
	})

	if err != nil {
		return err
	}

	items := result.([]dbtype.Node)
	return s.Index(INDEX_LIFESTYLE, items)
}

// IndexAdministrativeStatus ...
func (s *IndexService) IndexAdministrativeStatus() error {
	result, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []dbtype.Node

		result, err := tx.Run("MATCH (n:ObjectConcept {sctid: '307824009', active: '1'})<-[:ISA*1..6]-(children)-[:HAS_DESCRIPTION]->(description: Description) WHERE description.descriptionType <> 'FSN' RETURN description", nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, result.Record().Values[0].(dbtype.Node))
		}

		if err = result.Err(); err != nil {
			return nil, err
		}

		return list, nil
	})

	if err != nil {
		return err
	}

	items := result.([]dbtype.Node)
	return s.Index(INDEX_ADMINISTRATIVE_STATUS, items)
}

// IndexMentalState ...
func (s *IndexService) IndexMentalState() error {
	result, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []dbtype.Node

		result, err := tx.Run("MATCH (n:ObjectConcept {sctid: '36456004', active: '1'})<-[:ISA*1..6]-(children)-[:HAS_DESCRIPTION]->(description: Description) WHERE description.descriptionType <> 'FSN' RETURN description", nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, result.Record().Values[0].(dbtype.Node))
		}

		if err = result.Err(); err != nil {
			return nil, err
		}

		return list, nil
	})

	if err != nil {
		return err
	}

	items := result.([]dbtype.Node)
	return s.Index(INDEX_MENTAL_STATE, items)
}

// IndexImmunization ...
func (s *IndexService) IndexImmunization() error {
	result, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []dbtype.Node

		result, err := tx.Run("MATCH (n:ObjectConcept {sctid: '127785005', active: '1'})<-[:ISA*1..6]-(children)-[:HAS_DESCRIPTION]->(description: Description) WHERE description.descriptionType <> 'FSN' RETURN description", nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, result.Record().Values[0].(dbtype.Node))
		}

		if err = result.Err(); err != nil {
			return nil, err
		}

		return list, nil
	})

	if err != nil {
		return err
	}

	items := result.([]dbtype.Node)
	return s.Index(INDEX_IMMUNIZATION, items)
}

// IndexAllergicCodition ...
func (s *IndexService) IndexAllergicCondition() error {
	result, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []dbtype.Node

		result, err := tx.Run("MATCH (n:ObjectConcept {sctid: '473011001', active: '1'})<-[:ISA*1..10]-(children)-[:HAS_DESCRIPTION]->(description: Description) WHERE description.descriptionType <> 'FSN' RETURN description", nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, result.Record().Values[0].(dbtype.Node))
		}

		if err = result.Err(); err != nil {
			return nil, err
		}

		return list, nil
	})

	if err != nil {
		return err
	}

	items := result.([]dbtype.Node)
	return s.Index(INDEX_ALLERGIC_CONDITION, items)
}

// IndexIntolerance ...
func (s *IndexService) IndexIntolerance() error {
	result, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []dbtype.Node

		result, err := tx.Run("MATCH (n:ObjectConcept {sctid: '782197009', active: '1'})<-[:ISA*1..6]-(children)-[:HAS_DESCRIPTION]->(description: Description) WHERE description.descriptionType <> 'FSN' RETURN description", nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, result.Record().Values[0].(dbtype.Node))
		}

		if err = result.Err(); err != nil {
			return nil, err
		}

		return list, nil
	})

	if err != nil {
		return err
	}

	items := result.([]dbtype.Node)
	return s.Index(INDEX_INTOLERANCE, items)
}

// IndexHospitalAdmission ...
func (s *IndexService) IndexHospitalAdmission() error {
	result, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []dbtype.Node

		result, err := tx.Run("MATCH (n:ObjectConcept {sctid: '32485007', active: '1'})<-[:ISA*1..6]-(children)-[:HAS_DESCRIPTION]->(description: Description) WHERE description.descriptionType <> 'FSN' RETURN description", nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, result.Record().Values[0].(dbtype.Node))
		}

		if err = result.Err(); err != nil {
			return nil, err
		}

		return list, nil
	})

	if err != nil {
		return err
	}

	items := result.([]dbtype.Node)
	return s.Index(INDEX_HOSPITAL_ADMISSION, items)
}

// IndexHistoryClinicalFinding ...
func (s *IndexService) IndexHistoryClinicalFinding() error {
	result, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []dbtype.Node

		result, err := tx.Run("MATCH (n:ObjectConcept {sctid: '417662000', active: '1'})<-[:ISA*1..6]-(children)-[:HAS_DESCRIPTION]->(description: Description) WHERE description.descriptionType <> 'FSN' RETURN description", nil)
		if err != nil {
			return nil, err
		}

		for result.Next() {
			list = append(list, result.Record().Values[0].(dbtype.Node))
		}

		if err = result.Err(); err != nil {
			return nil, err
		}

		return list, nil
	})

	if err != nil {
		return err
	}

	items := result.([]dbtype.Node)
	return s.Index(INDEX_HISTORY_CLINICAL_FINDING, items)
}

func (s *IndexService) Index(index string, items []dbtype.Node) error {
	c := redisearch.NewClient(os.Getenv("REDIS_ADDRESS"), index)
	c.DropIndex(true)

	sc := redisearch.NewSchema(redisearch.DefaultOptions).
		AddField(redisearch.NewTextField("id")).
		AddField(redisearch.NewTextField("caseSignificanceId")).
		AddField(redisearch.NewTextField("nodetype")).
		AddField(redisearch.NewTextField("acceptabilityId")).
		AddField(redisearch.NewTextField("effectiveTime")).
		AddField(redisearch.NewTextField("refsetId")).
		AddField(redisearch.NewTextField("active")).
		AddField(redisearch.NewTextField("languageCode")).
		AddField(redisearch.NewTextField("id128bit")).
		AddField(redisearch.NewTextField("descriptionType")).
		AddField(redisearch.NewTextField("term")).
		AddField(redisearch.NewTextField("typeId")).
		AddField(redisearch.NewTextField("moduleId")).
		AddField(redisearch.NewTextField("sctid"))

	indexDefinition := redisearch.NewIndexDefinition().AddPrefix(index + ":")
	if err := c.CreateIndexWithIndexDefinition(sc, indexDefinition); err != nil {
		return err
	}

	var docs []redisearch.Document

	for _, item := range items {
		id := strconv.Itoa(int(item.Id))
		props := item.Props

		doc := redisearch.NewDocument(index+":"+id, 1.0)

		doc.Set("id", id).
			Set("caseSignificanceId", props["caseSignificanceId"].(string)).
			Set("nodetype", props["nodetype"].(string)).
			Set("acceptabilityId", props["acceptabilityId"].(string)).
			Set("effectiveTime", props["effectiveTime"].(string)).
			Set("refsetId", props["refsetId"].(string)).
			Set("active", props["active"].(string)).
			Set("languageCode", props["languageCode"].(string)).
			Set("id128bit", props["id128bit"].(string)).
			Set("descriptionType", props["descriptionType"].(string)).
			Set("term", props["term"].(string)).
			Set("typeId", props["typeId"].(string)).
			Set("moduleId", props["moduleId"].(string)).
			Set("sctid", props["sctid"].(string))

		docs = append(docs, doc)
	}

	if err := c.IndexOptions(redisearch.IndexingOptions{
		Replace: true,
	}, docs...); err != nil {
		return err
	}

	fmt.Printf("Finished indexing %s\n", index)

	return nil
}
