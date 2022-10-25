package repository_test

import (
	"database/sql"
	"log"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/models"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/repository"
)

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
	Code:         "CD 1",
	Display:      "Code 1",
	UserSelected: false,
	Definition:   "",
}

func TestCreate(t *testing.T) {
	r := StubCodingRepository{}
	db, mock := r.NewMock()

	repo := repository.NewCodingRepository(db)

	defer func() {
		repo.DB.Close()
	}()

	query := "INSERT INTO codings \\(id, system, version, code, display, definition\\) VALUES \\(\\?, \\?, \\?, \\?, \\?, \\?\\)"

	prep := mock.ExpectPrepare(query)
	prep.ExpectExec().WithArgs(coding.ID, coding.System, coding.Version, coding.Code, coding.Display, coding.Definition).WillReturnResult(sqlmock.NewResult(0, 1))

	result, err := repo.Insert(coding)
	assert.NoError(t, err)

	lastInsertId, err := result.LastInsertId()
	assert.NoError(t, err)
	assert.Equal(t, lastInsertId, int64(0))

	rowsAffected, err := result.RowsAffected()
	assert.NoError(t, err)
	assert.Equal(t, rowsAffected, int64(1))
}

func TestCreateBulk(t *testing.T) {
	r := StubCodingRepository{}
	db, mock := r.NewMock()

	repo := repository.NewCodingRepository(db)

	defer func() {
		repo.DB.Close()
	}()

	query := "INSERT INTO codings \\(id, system, version, code, display, definition\\) VALUES \\(\\?, \\?, \\?, \\?, \\?, \\?\\)"

	insertRows := []*models.Coding{coding}

	prep := mock.ExpectExec(query)

	for _, row := range insertRows {
		prep.WithArgs(row.ID, row.System, row.Version, row.Code, row.Display, row.Definition)
	}

	prep.WillReturnResult(sqlmock.NewResult(0, 1))

	result, err := repo.InsertBulk(insertRows)
	assert.NoError(t, err)

	rowsAffected, err := result.RowsAffected()
	assert.NoError(t, err)
	assert.Equal(t, rowsAffected, int64(1))
}

func TestCountBySystem(t *testing.T) {

	r := StubCodingRepository{}
	db, mock := r.NewMock()

	repo := repository.NewCodingRepository(db)

	defer func() {
		repo.DB.Close()
	}()

	query := "SELECT (.+) AS count FROM codings WHERE system = \\?"

	countRows := sqlmock.NewRows([]string{"count"}).AddRow(1)
	mock.ExpectQuery(query).WithArgs(coding.System).WillReturnRows(countRows)

	count, err := repo.CountBySystem(coding.System)

	assert.NoError(t, err)
	assert.Equal(t, 1, count)
}
