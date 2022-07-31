package targetsource

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/dustin/go-humanize"
	opensearch "github.com/opensearch-project/opensearch-go/v2"
	"github.com/opensearch-project/opensearch-go/v2/opensearchapi"
	"github.com/tensorsystems/tensoremr/apps/analytics/pkg/datasource"
	"gorm.io/gorm"
)

type OpenSearchTarget struct {
	DB           *gorm.DB
	SearchClient *opensearch.Client
}

func ProvideOpenSearchTarget(DB *gorm.DB, Client *opensearch.Client) OpenSearchTarget {
	return OpenSearchTarget{DB: DB, SearchClient: Client}
}

// PatientsBulkInsert ...
func (j *OpenSearchTarget) PatientsBulkInsert() error {
	var patientsDS datasource.Patients
	patientsDS.DB = j.DB

	patients, err := patientsDS.GetAllPatients()

	if err != nil {
		log.Fatal("failed to get documents ", err)
	}

	if err := j.IndexBulk("patients", patients); err != nil {
		log.Fatal("failed to insert documents ", err)
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
				log.Fatal("failed to insert document ", err)
				return err
			}

			if res.IsError() {
				numErrors += numItems
				if err := json.NewDecoder(res.Body).Decode(&raw); err != nil {
					log.Fatalf("Failure to to parse response body: %s", err)
				} else {
					log.Printf("  Error: [%d] %s: %s",
						res.StatusCode,
						raw["error"].(map[string]interface{})["type"],
						raw["error"].(map[string]interface{})["reason"],
					)
				}
			} else {
				if err := json.NewDecoder(res.Body).Decode(&blk); err != nil {
					log.Fatalf("Failure to to parse response body: %s", err)
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
		log.Fatalf(
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