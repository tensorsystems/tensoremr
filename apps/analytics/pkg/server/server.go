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
	"crypto/tls"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/go-redis/redis/v8"
	opensearch "github.com/opensearch-project/opensearch-go/v2"
	"github.com/robfig/cron/v3"
	"github.com/tensorsystems/tensoremr/apps/analytics/pkg/targetsource"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Server ...
type Server struct {
	DB           *gorm.DB
	SearchClient *opensearch.Client
	Cron         *cron.Cron
	Redis        *redis.Client
}

func NewServer() *Server {
	server := &Server{}

	if err := server.OpenPostgres(); err != nil {
		log.Fatalf("gorm: could not connect to db %q", err)
	}

	if err := server.OpenSearch(); err != nil {
		log.Fatalf("OpenSearch: could not connect to node %q", err)
	}

	if err := server.OpenCron(); err != nil {
		log.Fatalf("Cron: could not start cron %q", err)
	}

	server.BulkIndexAll()
	server.RegisterJobs()
	server.StartHttpServer()

	// fmt.Printf("Starting server at port 8080\n")
	// if err := http.ListenAndServe(":8081", nil); err != nil {
	// 	log.Fatal(err)
	// }

	return server
}

func (s *Server) StartHttpServer() {
	fmt.Printf("Starting server at port 8085\n")
	http.HandleFunc("/_bulkIndex", s.bulkIndexHandler)
	log.Fatal(http.ListenAndServe(":8085", nil))
}

func (s *Server) bulkIndexHandler(w http.ResponseWriter, r *http.Request) {
	s.BulkIndexAll()
	io.WriteString(w, "That was a success!\n")
}

func (s *Server) OpenSearch() error {
	openSearchAddress := os.Getenv("OPENSEARCH_ADDRESS")

	client, err := opensearch.NewClient(opensearch.Config{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		},
		Addresses: []string{openSearchAddress},
		Username:  "admin",
		Password:  "admin",
	})

	if err != nil {
		return err
	}

	// Print OpenSearch version information on console.
	fmt.Println(client.Info())

	s.SearchClient = client

	return nil
}

// OpenCron ...
func (s *Server) OpenCron() error {
	s.Cron = cron.New()
	return nil
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

// Register Jobs ...
func (s *Server) RegisterJobs() {
	s.Cron.AddFunc("0 8 * * *", func() {
		s.BulkIndexAll()
		fmt.Println("That was a success!")
	})

	s.Cron.Start()
}

// GetUpdates ...
func (s *Server) GetUpdates() {
	openSearchTarget := targetsource.ProvideOpenSearchTarget(s.DB, s.SearchClient, s.Redis, s.Cron)
	openSearchTarget.PatientsInsertUpdates()
}

// BulkIndexAll ...
func (s *Server) BulkIndexAll() {
	openSearchTarget := targetsource.ProvideOpenSearchTarget(s.DB, s.SearchClient, s.Redis, s.Cron)

	openSearchTarget.PatientsBulkInsert()
	openSearchTarget.AppointmentsBulkInsert()
	openSearchTarget.DiagnosticProceduresBulkInsert()
	openSearchTarget.SurgicalProceduresBulkInsert()
	openSearchTarget.TreatmentsBulkInsert()
	openSearchTarget.MedicalPrescriptionsBulkInsert()
	openSearchTarget.EyewearPrescriptionsBulkInsert()
	openSearchTarget.PatientDiagnosesBulkInsert()
}
