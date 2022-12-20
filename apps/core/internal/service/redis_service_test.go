package service_test

import (
	"context"
	"testing"

	"github.com/go-redis/redismock/v8"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)



var ctx = context.TODO()

func TestIncrementMrn(t *testing.T) {
	db, mock := redismock.NewClientMock()

	mrnKey := "mrn"

	mock.ExpectIncr(mrnKey).SetVal(1)

	cmd := db.Incr(ctx, mrnKey)
	if err := cmd.Err(); err != nil {
		t.Error(err)
	}

	val := cmd.Val()
	if val != 1 {
		assert.Equal(t, 1, val)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Error(err)
	}
}

func TestCreateRedisPatient(t *testing.T) {
	db, mock := redismock.NewClientMock()

	patient := map[string]interface{}{
		"id":         "1",
		"givenName":  "Test",
		"familyName": "Patient",
	}

	patientKey := "patient:1"
	mock.ExpectHSet(patientKey, patient).SetVal(1)

	cmd := db.HSet(ctx, patientKey, patient)
	if err := cmd.Err(); err != nil {
		t.Error(err)
	}

	val := cmd.Val()
	if val != 1 {
		assert.Equal(t, 1, val)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Error(err)
	}
}

func TestCreateRedisPatientWithMrn(t *testing.T) {
	db, mock := redismock.NewClientMock()

	patient := map[string]interface{}{
		"id":         "1",
		"givenName":  "Test",
		"familyName": "Patient",
		"mrn":        int64(1),
	}

	mock.ExpectWatch("patient:1")
	mock.ExpectIncr("mrn").SetVal(1)
	mock.ExpectHSet("patient:1", patient).SetVal(1)

	redisService := service.RedisService{RedisClient: db}

	_, err := redisService.CreatePatient(patient)
	if err != nil {
		t.Error(err)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Error(err)
	}
}
