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
	"net"
	"os"

	"github.com/go-redis/redis/v8"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
	"github.com/tensorsystems/tensoremr/apps/go-terminology/pkg/service"
	pb "github.com/tensorsystems/tensoremr/libs/proto/pkg/terminology"
	"google.golang.org/grpc"
)

// Server ...
type Server struct {
	NeoDriver neo4j.Driver
	Redis     *redis.Client
}

func NewServer() *Server {
	server := &Server{}

	if err := server.OpenNeo4j(); err != nil {
		log.Fatalf("neo4j: could not connect to db %q", err)
	}

	if err := server.OpenRedis(); err != nil {
		log.Fatalf("redis: could not connect to redis %q", err)
	}

	if err := server.OpenGRPC(); err != nil {
		log.Fatalf("grpc: could not start grpc server %q", err)
	}

	server.IndexItems()

	defer server.NeoDriver.Close()

	return nil
}

func (server *Server) OpenGRPC() error {
	port := os.Getenv("GRPC_PORT")
	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		return err
	}

	s := grpc.NewServer()
	pb.RegisterTerminologyServer(s, &service.ApiService{})
	log.Printf("grpc server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		return err
	}

	return nil
}

// OpenNeo4j ...
func (s *Server) OpenNeo4j() error {
	dbName := os.Getenv("DB_NAME")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUserName := os.Getenv("DB_USER_NAME")
	dbPassword := os.Getenv("DB_PASSWORD")

	uri := fmt.Sprintf("bolt://%s:%s/%s", dbHost, dbPort, dbName)

	driver, err := neo4j.NewDriver(uri, neo4j.BasicAuth(dbUserName, dbPassword, ""))

	if err != nil {
		return err
	}

	s.NeoDriver = driver

	return nil
}

// OpenRedis ...
func (s *Server) OpenRedis() error {
	redisAddress := os.Getenv("REDIS_ADDRESS")

	rdb := redis.NewClient(&redis.Options{
		Addr:     redisAddress,
		Password: "",
		DB:       0,
	})

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatal("couldn't connect to redis: ", err)
	}

	s.Redis = rdb

	return nil
}

// IndexItems ...
func (s *Server) IndexItems() {
	neoService := service.IndexService{
		NeoDriver: s.NeoDriver,
		Redis:     s.Redis,
	}

	if err := neoService.IndexHistoryOfDisorder(); err != nil {
		log.Fatal("error indexing history of disorder: ", err)
	}
}
