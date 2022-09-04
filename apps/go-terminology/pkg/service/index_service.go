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
	"os"
	"strconv"

	"github.com/RediSearch/redisearch-go/redisearch"
	"github.com/go-redis/redis/v8"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j/dbtype"
)

type IndexService struct {
	NeoSession neo4j.Session
	Redis     *redis.Client
}

// IndexHistoryOfDisorder ...
func (s *IndexService) IndexHistoryOfDisorder() error {
	result, err := s.NeoSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		var list []dbtype.Node

		result, err := tx.Run("MATCH (n:ObjectConcept {sctid: '312850006', active: '1'})<-[*1..6]-(children)-[:HAS_DESCRIPTION]->(description: Description) WHERE description.descriptionType <> 'FSN' RETURN description", nil)
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

	c := redisearch.NewClient(os.Getenv("REDIS_ADDRESS"), "history-of-disorder")

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

	c.Drop()

	if err := c.CreateIndex(sc); err != nil {
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

	// docs, total, err := c.Search(redisearch.NewQuery("History of diabe*").
	// 	Limit(0, 20))

	// for _, doc := range docs {
	// 	fmt.Println(doc.Id, doc.Properties["sctid"], total, err)
	// }

	return nil
}
