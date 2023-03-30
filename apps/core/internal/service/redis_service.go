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

	"github.com/go-redis/redis/v8"
)

type RedisService struct {
	RedisClient *redis.Client
}

func NewRedisService(client *redis.Client) RedisService {
	return RedisService{
		RedisClient: client,
	}
}

func (r *RedisService) CreatePatient(patient map[string]interface{}) (int64, error) {
	ctx := context.Background()
	key := "patient:" + patient["id"].(string)
	var patientMrn int64

	tx := func(tx *redis.Tx) error {
		_, err := tx.TxPipelined(ctx, func(p redis.Pipeliner) error {
			cmd := tx.Incr(ctx, "mrn")
			if err := cmd.Err(); err != nil {
				return err
			}

			mrn := cmd.Val()

			patient["mrn"] = mrn
			patientMrn = mrn

			cmd = tx.HSet(ctx, key, patient)
			if err := cmd.Err(); err != nil {
				return err
			}

			return nil
		})

		return err
	}

	return patientMrn, r.RedisClient.Watch(ctx, tx, key)
}
