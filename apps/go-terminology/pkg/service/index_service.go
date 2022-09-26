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

// IndexHistoryOfDisorder ...
func (s *IndexService) IndexHistoryOfDisorder() error {
	result, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []dbtype.Node

		// Past History of Clinical Finding
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

	items := result.([]dbtype.Node)

	c := redisearch.NewClient(os.Getenv("REDIS_ADDRESS"), "hod")
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

	indexDefinition := redisearch.NewIndexDefinition().AddPrefix("hod:")
	if err := c.CreateIndexWithIndexDefinition(sc, indexDefinition); err != nil {
		return err
	}

	var docs []redisearch.Document

	for _, item := range items {
		id := strconv.Itoa(int(item.Id))
		props := item.Props

		doc := redisearch.NewDocument("hod:"+id, 1.0)

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

	fmt.Println("Finished indexing history of disorder")

	// docs, total, err := c.Search(redisearch.NewQuery("History of hypert*").
	// 	Limit(0, 20))

	// for _, doc := range docs {
	// 	fmt.Println(doc.Id, doc.Properties["term"], total, err)
	// }

	return nil
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

	c := redisearch.NewClient(os.Getenv("REDIS_ADDRESS"), "fh")
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

	indexDefinition := redisearch.NewIndexDefinition().AddPrefix("fh:")
	if err := c.CreateIndexWithIndexDefinition(sc, indexDefinition); err != nil {
		return err
	}

	var docs []redisearch.Document

	for _, item := range items {
		id := strconv.Itoa(int(item.Id))
		props := item.Props

		doc := redisearch.NewDocument("fh:"+id, 1.0)
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

	fmt.Println("Finished indexing familiy histories")

	return nil
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

	c := redisearch.NewClient(os.Getenv("REDIS_ADDRESS"), "procedure")
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

	indexDefinition := redisearch.NewIndexDefinition().AddPrefix("procedure:")
	if err := c.CreateIndexWithIndexDefinition(sc, indexDefinition); err != nil {
		return err
	}

	var docs []redisearch.Document

	for _, item := range items {
		id := strconv.Itoa(int(item.Id))
		props := item.Props

		doc := redisearch.NewDocument("procedure:"+id, 1.0)
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

	fmt.Println("Finished indexing procedures")

	return nil
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

	c := redisearch.NewClient(os.Getenv("REDIS_ADDRESS"), "sh")
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

	indexDefinition := redisearch.NewIndexDefinition().AddPrefix("sh:")
	if err := c.CreateIndexWithIndexDefinition(sc, indexDefinition); err != nil {
		return err
	}

	var docs []redisearch.Document

	for _, item := range items {
		id := strconv.Itoa(int(item.Id))
		props := item.Props

		doc := redisearch.NewDocument("sh:"+id, 1.0)

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

	fmt.Println("Finished indexing social history")

	// docs, total, err := c.Search(redisearch.NewQuery("History of hypert*").
	// 	Limit(0, 20))

	// for _, doc := range docs {
	// 	fmt.Println(doc.Id, doc.Properties["term"], total, err)
	// }

	return nil
}