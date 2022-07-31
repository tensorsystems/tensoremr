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
	"crypto/tls"
	"fmt"
	"log"
	"net/http"
	"os"

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

	server.BulkInsert()

	// fmt.Printf("Starting server at port 8080\n")
	// if err := http.ListenAndServe(":8080", nil); err != nil {
	// 	log.Fatal(err)
	// }

	return server
}

func (s *Server) OpenSearch() error {
	client, err := opensearch.NewClient(opensearch.Config{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		},
		Addresses: []string{"https://localhost:9200"},
		Username:  "admin",
		Password:  "admin",
	})

	if err != nil {
		fmt.Print("Error: ", err)
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

// Register Jobs ...
func (s *Server) RegisterJobs() {
	s.Cron.AddFunc("@hourly", func() {

	})

	s.Cron.Start()
}

// BulkInsert ...
func (s *Server) BulkInsert() {
	openSourceTarget := targetsource.ProvideOpenSearchTarget(s.DB, s.SearchClient)

	// openSourceTarget.PatientsBulkInsert()
	// openSourceTarget.AppointmentsBulkInsert()
	// openSourceTarget.DiagnosticProceduresBulkInsert()
	// openSourceTarget.SurgicalProceduresBulkInsert()
	openSourceTarget.TreatmentsBulkInsert()
}
