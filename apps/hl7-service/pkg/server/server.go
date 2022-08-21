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

package server

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/go-redis/redis/v8"
	"github.com/tensorsystems/tensoremr/apps/hl7-service/pkg/service"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Server ...
type Server struct {
	DB    *gorm.DB
	Redis *redis.Client
}

func NewServer() *Server {
	server := &Server{}

	if err := server.OpenPostgres(); err != nil {
		log.Fatalf("gorm: could not connect to db %q", err)
	}

	if err := server.OpenRedis(); err != nil {
		log.Fatalf("Redis: could not start connection %q", err)
	}

	server.Subscribe()

	return nil
}

func (s *Server) Subscribe() {
	sub := service.ProvideSubscription(s.DB, s.Redis)
	sub.CreateWorklistSubscription()
}

// OpenPostgres ...
func (m *Server) OpenPostgres() error {
	dbHost := os.Getenv("DB_HOST")
	// dbReplicationHost := os.Getenv("DB_REPLICATION_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")

	DBURL := fmt.Sprintf("host=%s port=%s user=%s dbname=%s sslmode=disable TimeZone=UTC password=%s", dbHost, dbPort, dbUser, dbName, dbPassword)
	db, err := gorm.Open(postgres.Open(DBURL), &gorm.Config{})

	if err != nil {
		return err
	}

	m.DB = db

	return nil
}

func (s *Server) OpenRedis() error {
	redisAddress := os.Getenv("REDIS_ADDRESS")

	rdb := redis.NewClient(&redis.Options{
		Addr:     redisAddress,
		Password: "",
		DB:       0,
	})

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		return err
	}

	s.Redis = rdb

	return nil
}
