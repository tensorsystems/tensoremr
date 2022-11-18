package targetsource

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/dustin/go-humanize"
	"github.com/go-redis/redis/v8"
	opensearch "github.com/opensearch-project/opensearch-go/v2"
	"github.com/opensearch-project/opensearch-go/v2/opensearchapi"
	"github.com/robfig/cron/v3"
	"github.com/tensorsystems/tensoremr/apps/analytics/pkg/datasource"
	"gorm.io/gorm"
)

type OpenSearchTarget struct {
	DB           *gorm.DB
	SearchClient *opensearch.Client
	Redis        *redis.Client
	Cron         *cron.Cron
}

func ProvideOpenSearchTarget(DB *gorm.DB, Client *opensearch.Client, Redis *redis.Client, Cron *cron.Cron) OpenSearchTarget {
	return OpenSearchTarget{DB: DB, SearchClient: Client, Redis: Redis, Cron: Cron}
}

// PatientsInsertUpdates ...
func (j *OpenSearchTarget) PatientsInsertUpdates() error {
	var postgresDs datasource.PostgresDataSource
	postgresDs.DB = j.DB

	pubsub := j.Redis.Subscribe(context.Background(), "surgical-procedures-update", "appointments-update", "patients-update", "diagnostic-procedures-update", "treatments-update", "patient-diagnoses-update", "medical-prescriptions-update", "eyewear-prescriptions-update")

	ch := pubsub.Channel()

	for msg := range ch {
		if msg.Channel == "surgical-procedures-update" {
			id, err := strconv.Atoi(msg.Payload)
			if err != nil {
				log.Printf("Could not convert to int")
				return err
			}

			surgicalProcedure, err := postgresDs.GetSurgicalProcedureById(id)
			if err != nil {
				log.Printf("Could not find surgical procedure")
				return err
			}

			j.IndexItem("surgical-procedures", msg.Payload, surgicalProcedure)
		}

		if msg.Channel == "appointments-update" {
			id, err := strconv.Atoi(msg.Payload)
			if err != nil {
				log.Printf("Could not convert to int")
				return err
			}

			appointment, err := postgresDs.GetAppointmentById(id)
			if err != nil {
				log.Printf("Could not find appointment")
				return err
			}

			j.IndexItem("appointments", msg.Payload, appointment)
		}

		if msg.Channel == "patients-update" {
			id, err := strconv.Atoi(msg.Payload)
			if err != nil {
				log.Printf("Could not convert to int")
				return err
			}

			patient, err := postgresDs.GetPatientById(id)
			if err != nil {
				log.Printf("Could not find patient")
				return err
			}

			j.IndexItem("patients", msg.Payload, patient)
		}

		if msg.Channel == "diagnostic-procedures-update" {
			id, err := strconv.Atoi(msg.Payload)
			if err != nil {
				log.Printf("Could not convert to int")
				return err
			}

			diagnosticProcedure, err := postgresDs.GetDiagnosticProcedureById(id)
			if err != nil {
				log.Printf("Could not find patient")
				return err
			}

			j.IndexItem("diagnostic-procedures", msg.Payload, diagnosticProcedure)
		}

		if msg.Channel == "treatments-update" {
			id, err := strconv.Atoi(msg.Payload)
			if err != nil {
				log.Printf("Could not convert to int")
				return err
			}

			treatment, err := postgresDs.GetTreatmentById(id)
			if err != nil {
				log.Printf("Could not find patient")
				return err
			}

			j.IndexItem("treatments", msg.Payload, treatment)
		}

		if msg.Channel == "patient-diagnoses-update" {
			id, err := strconv.Atoi(msg.Payload)
			if err != nil {
				log.Printf("Could not convert to int")
				return err
			}

			patientDiagnosis, err := postgresDs.GetPatientDiagnosisById(id)
			if err != nil {
				log.Printf("Could not find patient")
				return err
			}

			j.IndexItem("patient-diagnoses", msg.Payload, patientDiagnosis)
		}

		if msg.Channel == "medical-prescriptions-update" {
			id, err := strconv.Atoi(msg.Payload)
			if err != nil {
				log.Printf("Could not convert to int")
				return err
			}

			medicalPrescription, err := postgresDs.GetMedicalPrescriptionById(id)
			if err != nil {
				log.Printf("Could not find patient")
				return err
			}

			j.IndexItem("medical-prescriptions", msg.Payload, medicalPrescription)
		}

		if msg.Channel == "eyewear-prescriptions-update" {
			id, err := strconv.Atoi(msg.Payload)
			if err != nil {
				log.Printf("Could not convert to int")
				return err
			}

			eyewearPrescription, err := postgresDs.GetEyewearPrescriptionById(id)
			if err != nil {
				log.Printf("Could not find patient")
				return err
			}

			j.IndexItem("eyewear-prescriptions", msg.Payload, eyewearPrescription)
		}

		fmt.Println(msg.Channel, msg.Payload)
	}

	defer pubsub.Close()

	return nil
}

// PatientsBulkInsert ...
func (j *OpenSearchTarget) PatientsBulkInsert() error {
	var postgresDs datasource.PostgresDataSource
	postgresDs.DB = j.DB

	patients, err := postgresDs.GetAllPatients()

	if err != nil {
		return err
	}

	if err := j.IndexBulk("patients", patients); err != nil {
		return err
	}

	return nil
}

// AppointmentsBulkInsert ...
func (j *OpenSearchTarget) AppointmentsBulkInsert() error {
	var postgresDs datasource.PostgresDataSource
	postgresDs.DB = j.DB

	appointments, err := postgresDs.GetAllAppointments()

	if err != nil {
		return err
	}

	if err := j.IndexBulk("appointments", appointments); err != nil {

		return err
	}

	return nil
}

// DiagnosticProceduresBulkInsert ...
func (j *OpenSearchTarget) DiagnosticProceduresBulkInsert() error {
	var postgresDs datasource.PostgresDataSource
	postgresDs.DB = j.DB

	diagnosticProcedures, err := postgresDs.GetAllDiagnosticProcedures()

	if err != nil {
		return err
	}

	if err := j.IndexBulk("diagnostic-procedures", diagnosticProcedures); err != nil {
		return err
	}

	return nil
}

// SurgicalProceduresBulkInsert ...
func (j *OpenSearchTarget) SurgicalProceduresBulkInsert() error {
	var postgresDs datasource.PostgresDataSource
	postgresDs.DB = j.DB

	surgicalProcedures, err := postgresDs.GetAllSurgicalProcedures()

	if err != nil {
		return err
	}

	if err := j.IndexBulk("surgical-procedures", surgicalProcedures); err != nil {

		return err
	}

	return nil
}

// TreatmentsBulkInsert ...
func (j *OpenSearchTarget) TreatmentsBulkInsert() error {
	var postgresDs datasource.PostgresDataSource
	postgresDs.DB = j.DB

	treatments, err := postgresDs.GetAllTreatments()

	if err != nil {
		return err
	}

	if err := j.IndexBulk("treatments", treatments); err != nil {

		return err
	}

	return nil
}

// MedicalPrescriptionsBulkInsert ...
func (j *OpenSearchTarget) MedicalPrescriptionsBulkInsert() error {
	var postgresDs datasource.PostgresDataSource
	postgresDs.DB = j.DB

	items, err := postgresDs.GetAllMedicalPrescriptions()

	if err != nil {
		// log.Fatal("failed to get documents ", err)
		return err
	}

	if err := j.IndexBulk("medical-prescriptions", items); err != nil {

		return err
	}

	return nil
}

// EyewearPrescriptionsBulkInsert ...
func (j *OpenSearchTarget) EyewearPrescriptionsBulkInsert() error {
	var postgresDs datasource.PostgresDataSource
	postgresDs.DB = j.DB

	items, err := postgresDs.GetAllEyewearPrescriptions()

	if err != nil {
		//log.Fatal("failed to get documents ", err)
		return err
	}

	if err := j.IndexBulk("eyewear-prescriptions", items); err != nil {

		return err
	}

	return nil
}

// PatientDiagnosesBulkInsert ...
func (j *OpenSearchTarget) PatientDiagnosesBulkInsert() error {
	var postgresDs datasource.PostgresDataSource
	postgresDs.DB = j.DB

	items, err := postgresDs.GetAllPatientDiagnoses()

	if err != nil {
		// log.Fatal("failed to get documents ", err)
		return err
	}

	if err := j.IndexBulk("patient-diagnoses", items); err != nil {

		return err
	}

	return nil
}

type bulkResponse struct {
	Errors bool `json:"errors"`
	Items  []struct {
		Index struct {
			ID     string `json:"_id"`
			Result string `json:"result"`
			Status int    `json:"status"`
			Error  struct {
				Type   string `json:"type"`
				Reason string `json:"reason"`
				Cause  struct {
					Type   string `json:"type"`
					Reason string `json:"reason"`
				} `json:"caused_by"`
			} `json:"error"`
		} `json:"index"`
	} `json:"items"`
}

func (j *OpenSearchTarget) IndexItem(index string, itemId string, item map[string]interface{}) error {
	json, _ := json.Marshal(item)
	document := bytes.NewReader(json)

	req := opensearchapi.IndexRequest{Index: index, DocumentID: itemId, Body: document}
	insertResponse, err := req.Do(context.Background(), j.SearchClient)
	if err != nil {
		fmt.Println("failed to insert document ", err)
	}
	fmt.Println(insertResponse)
	return nil
}

func (j *OpenSearchTarget) IndexBulk(index string, items []map[string]interface{}) error {
	var (
		buf        bytes.Buffer
		count      int
		batch      int = 1000
		numItems   int
		numErrors  int
		numIndexed int
		numBatches int
		blk        *bulkResponse
		raw        map[string]interface{}
		currBatch  int
	)

	count = len(items)

	if count%batch == 0 {
		numBatches = (count / batch)
	} else {
		numBatches = (count / batch) + 1
	}

	start := time.Now().UTC()

	for i, item := range items {
		numItems++

		currBatch = i / batch
		if i == count-1 {
			currBatch++
		}

		m := item["meta"].(map[string]interface{})
		d := item["data"].(map[string]interface{})

		meta := []byte(fmt.Sprintf(`{ "index" : { "_id" : "%d", "_index": "%s" } }%s`, m["_id"], m["_index"], "\n"))
		data, _ := json.Marshal(d)
		data = append(data, "\n"...)

		buf.Grow(len(meta) + len(data))
		buf.Write(meta)
		buf.Write(data)

		if i > 0 && i%batch == 0 || i == count-1 {
			fmt.Printf("[%d/%d] ", currBatch, numBatches)

			req := opensearchapi.BulkRequest{
				Body: bytes.NewReader(buf.Bytes()),
			}

			res, err := req.Do(context.Background(), j.SearchClient)
			if err != nil {
				log.Println("failed to insert document ", err)
				return err
			}

			if res.IsError() {
				numErrors += numItems
				if err := json.NewDecoder(res.Body).Decode(&raw); err != nil {
					log.Printf("Failure to to parse response body: %s", err)
				} else {
					log.Printf("  Error: [%d] %s: %s",
						res.StatusCode,
						raw["error"].(map[string]interface{})["type"],
						raw["error"].(map[string]interface{})["reason"],
					)
				}
			} else {
				if err := json.NewDecoder(res.Body).Decode(&blk); err != nil {
					log.Printf("Failure to to parse response body: %s", err)
				} else {
					for _, d := range blk.Items {
						if d.Index.Status > 201 {
							numErrors++

							log.Printf("  Error: [%d]: %s: %s: %s: %s",
								d.Index.Status,
								d.Index.Error.Type,
								d.Index.Error.Reason,
								d.Index.Error.Cause.Type,
								d.Index.Error.Cause.Reason,
							)
						} else {
							numIndexed++
						}
					}
				}
			}

			res.Body.Close()

			buf.Reset()
			numItems = 0
		}
	}

	fmt.Print("\n")
	log.Println(strings.Repeat("▔", 65))

	dur := time.Since(start)

	if numErrors > 0 {
		log.Printf(
			"Indexed [%s] [%s] documents with [%s] errors in %s (%s docs/sec)",
			humanize.Comma(int64(numIndexed)),
			index,
			humanize.Comma(int64(numErrors)),
			dur.Truncate(time.Millisecond),
			humanize.Comma(int64(1000.0/float64(dur/time.Millisecond)*float64(numIndexed))),
		)
	} else {
		log.Printf(
			"Sucessfuly indexed [%s] [%s] documents in %s (%s docs/sec)",
			humanize.Comma(int64(numIndexed)),
			index,
			dur.Truncate(time.Millisecond),
			humanize.Comma(int64(1000.0/float64(dur/time.Millisecond)*float64(numIndexed))),
		)
	}

	return nil
}
