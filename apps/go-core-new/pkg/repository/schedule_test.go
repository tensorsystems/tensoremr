package repository_test

import (
	"database/sql"
	"log"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/models"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/repository"
)

type StubScheduleRepository struct{}

func (s *StubScheduleRepository) NewMock() (*sql.DB, sqlmock.Sqlmock) {
	db, mock, err := sqlmock.New()
	if err != nil {
		log.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}

	return db, mock
}

var schedule = &models.Schedule{
	ID:              "123",
	Active:          true,
	ServiceCategory: "",
	ServiceType:     "",
	Specialty:       "",
	Actor:           "",
	Recurring:       true,
	StartPeriod:     time.Now(),
	EndPeriod:       time.Now().AddDate(0, 1, 0),
}

func TestCountByPeriod(t *testing.T) {
	r := StubScheduleRepository{}
	db, mock := r.NewMock()

	repo := repository.NewScheduleRepository(db)

	defer func() {
		repo.DB.Close()
	}()

	query := "SELECT (.+) AS count FROM schedules WHERE startPeriod < \\? AND endPeriod > \\?"

	countRows := sqlmock.NewRows([]string{"count"}).AddRow(1)
	mock.ExpectQuery(query).WithArgs(schedule.StartPeriod, schedule.EndPeriod).WillReturnRows(countRows)

	count, err := repo.CountByEndPeriod(schedule.StartPeriod, schedule.EndPeriod)

	assert.NoError(t, err)
	assert.Equal(t, 1, count)
}
