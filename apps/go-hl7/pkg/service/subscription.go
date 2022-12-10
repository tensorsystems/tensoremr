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
	"encoding/json"
	"log"

	"github.com/go-redis/redis/v8"
	"gorm.io/gorm"
)

type Subscription struct {
	DB    *gorm.DB
	Redis *redis.Client
}

func ProvideSubscription(DB *gorm.DB, Redis *redis.Client) Subscription {
	return Subscription{DB: DB, Redis: Redis}
}

func (s *Subscription) CreateWorklistSubscription() error {
	pubsub := s.Redis.Subscribe(context.Background(), "hl7-create-worklist")

	ch := pubsub.Channel()

	for msg := range ch {
		if msg.Channel == "hl7-create-worklist" {
			rMsg := map[string]interface{}{}

			if err := json.Unmarshal([]byte(msg.Payload), &rMsg); err != nil {
				panic(err)
			}

			parse := ProvideParseMessagesService(s.DB)
			mwl, err := parse.ParseDiagnosticWorklist(rMsg)
			if err != nil {
				log.Println(err)
				return err
			}

			if err := mwl.CreateWorklistFile(); err != nil {
				log.Println(err)
				return err
			}

			if err := mwl.SendToPacs(); err != nil {
				log.Println(err)
				return err
			}
		}
	}

	defer pubsub.Close()

	return nil
}
