package seeds_test

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/models"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/repository"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/seeds"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/services"
)

type Concept struct {
	Code       string `json:"code"`
	Display    string `json:"display"`
	Definition string `json:"definition"`
}

type Response struct {
	ResourceType string    `json:"resourceType"`
	ID           string    `json:"id"`
	Url          string    `json:"url"`
	Version      string    `json:"version"`
	Name         string    `json:"name"`
	Concept      []Concept `json:"concept"`
}

var jsonResponse = &models.CodeSystemResponse{
	ResourceType: "CodeSystem",
	ID:           "some-type",
	Url:          "http://terminology.hl7.org/CodeSystem/code1",
	Version:      "1.0.0",
	Name:         "OrganizationType",
	Concept: []models.CodeSystemConcept{
		{Code: "CD1", Display: "Code 1", Definition: ""},
	},
}

type StubCodingRepository struct{}

func (s *StubCodingRepository) NewMock() (*sql.DB, sqlmock.Sqlmock) {
	db, mock, err := sqlmock.New()
	if err != nil {
		log.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}

	return db, mock
}

var coding = &models.Coding{
	ID:           "123",
	System:       "http://terminology.hl7.org/CodeSystem/code1",
	Version:      "1.0.0",
	Code:         "CD1",
	Display:      "Code 1",
	UserSelected: false,
	Definition:   "",
}

func TestSeedCodeSystem(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		r, _ := json.Marshal(&jsonResponse)
		rw.Write(r)
	}))

	defer srv.Close()

	service := services.NewCodeSystemService(srv.Client())
	resp, _ := service.GetCodes(srv.URL)

	var codeSystemResponse Response
	json.Unmarshal(resp, &codeSystemResponse)

	r := StubCodingRepository{}
	db, mock := r.NewMock()

	repo := repository.NewCodingRepository(db)

	defer func() {
		repo.DB.Close()
	}()

	seeder := seeds.NewSeeder(repo, service.Client)

	t.Run("seed data if not already seeded", func(t *testing.T) {
		countRows := sqlmock.NewRows([]string{"count"}).AddRow(0)
		mock.ExpectQuery("SELECT (.+) AS count FROM codings WHERE system = \\?").WithArgs(coding.System).WillReturnRows(countRows)
		count, _ := repo.CountBySystem(coding.Code)
		assert.Equal(t, 0, count)

		insertRows := []*models.Coding{coding}
		prep := mock.ExpectExec("INSERT INTO codings \\(id, system, version, code, display, definition\\) VALUES \\(\\?, \\?, \\?, \\?, \\?, \\?\\)")
		for _, row := range insertRows {
			prep.WithArgs(row.ID, row.System, row.Version, row.Code, row.Display, row.Definition)
		}
		prep.WillReturnResult(sqlmock.NewResult(0, 1))

		err := seeder.SeedCodeSystem("http://terminology.hl7.org/CodeSystem/code1", srv.URL)
		assert.NoError(t, err)
	})

	t.Run("does not seed if data with system already exists", func(t *testing.T) {
		countRows := sqlmock.NewRows([]string{"count"}).AddRow(1)
		mock.ExpectQuery("SELECT (.+) AS count FROM codings WHERE system = \\?").WithArgs(coding.System).WillReturnRows(countRows)

		err := seeder.SeedCodeSystem("http://terminology.hl7.org/CodeSystem/code1", srv.URL)
		assert.NoError(t, err)
	})
}
