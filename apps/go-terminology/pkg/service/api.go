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
	"os"

	"github.com/RediSearch/redisearch-go/redisearch"
	"github.com/go-redis/redis/v8"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
	pb "github.com/tensorsystems/tensoremr/libs/proto/pkg/terminology"
)

type ApiService struct {
	NeoDriver neo4j.Driver
	Redis     *redis.Client
	pb.UnimplementedTerminologyServer
}

func (s *ApiService) GetHistoryOfDisorders(ctx context.Context, in *pb.LookupRequest) (*pb.SnomedCtResponse, error) {
	c := redisearch.NewClient(os.Getenv("REDIS_ADDRESS"), "history-of-disorder")

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
