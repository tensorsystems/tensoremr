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

package main

import (
	"encoding/csv"
	"log"
	"os"

	"github.com/RediSearch/redisearch-go/redisearch"
)

func main() {
	c := redisearch.NewClient(os.Getenv("REDIS_ADDRESS"), os.Getenv("LOINC_INDEX"))

	// Check if index already exists
	_, err := c.Info()
	if err == nil {
		log.Println("Index already exists")
		return
	}

	// Read loinc file
	loincFile, err := os.Open("Loinc.csv")
	if err != nil {
		log.Fatalln(err)
	}

	// Get csv
	loincCsv, err := csv.NewReader(loincFile).ReadAll()
	if err != nil {
		log.Fatalln(err)
	}

	// Create index
	schema := redisearch.NewSchema(redisearch.DefaultOptions).
		AddField(redisearch.NewTextField("LOINC_NUM")).
		AddField(redisearch.NewTextField("PROPERTY")).
		AddField(redisearch.NewTextField("TIME_ASPCT")).
		AddField(redisearch.NewTextField("SYSTEM")).
		AddField(redisearch.NewTextField("SCALE_TYP")).
		AddField(redisearch.NewTextField("METHOD_TYP")).
		AddField(redisearch.NewTextField("CLASS")).
		AddField(redisearch.NewTextField("VersionLastChanged")).
		AddField(redisearch.NewTextField("DefinitionDescription")).
		AddField(redisearch.NewTextField("STATUS")).
		AddField(redisearch.NewTextField("CONSUMER_NAME")).
		AddField(redisearch.NewTextField("CLASSTYPE")).
		AddField(redisearch.NewTextField("FORMULA")).
		AddField(redisearch.NewTextField("EXMPL_ANSWERS")).
		AddField(redisearch.NewTextField("SURVEY_QUEST_TEXT")).
		AddField(redisearch.NewTextField("SURVEY_QUEST_SRC")).
		AddField(redisearch.NewTextField("UNITSREQUIRED")).
		AddField(redisearch.NewTextField("RELATEDNAMES2")).
		AddField(redisearch.NewTextField("SHORTNAME")).
		AddField(redisearch.NewTextField("ORDER_OBS")).
		AddField(redisearch.NewTextField("HL7_FIELD_SUBFIELD_ID")).
		AddField(redisearch.NewTextField("EXTERNAL_COPYRIGHT_NOTICE")).
		AddField(redisearch.NewTextField("EXAMPLE_UNITS")).
		AddField(redisearch.NewTextField("LONG_COMMON_NAME")).
		AddField(redisearch.NewTextField("EXAMPLE_UCUM_UNITS")).
		AddField(redisearch.NewTextField("STATUS_REASON")).
		AddField(redisearch.NewTextField("STATUS_TEXT")).
		AddField(redisearch.NewTextField("CHANGE_REASON_PUBLIC")).
		AddField(redisearch.NewTextField("COMMON_TEST_RANK")).
		AddField(redisearch.NewTextField("COMMON_ORDER_RANK")).
		AddField(redisearch.NewTextField("COMMON_SI_TEST_RANK")).
		AddField(redisearch.NewTextField("HL7_ATTACHMENT_STRUCTURE")).
		AddField(redisearch.NewTextField("EXTERNAL_COPYRIGHT_LINK")).
		AddField(redisearch.NewTextField("PanelType")).
		AddField(redisearch.NewTextField("AskAtOrderEntry")).
		AddField(redisearch.NewTextField("AssociatedObservations")).
		AddField(redisearch.NewTextField("VersionFirstReleased")).
		AddField(redisearch.NewTextField("ValidHL7AttachmentRequest")).
		AddField(redisearch.NewTextField("DisplayName"))

	if err := c.CreateIndex(schema); err != nil {
		log.Fatal(err)
	}

	// Create documents
	var docs []redisearch.Document
	for _, line := range loincCsv[1:] {
		doc := redisearch.NewDocument(line[0], 1.0)

		for colIdx, col := range line {
			doc.Set(loincCsv[0][colIdx], col)
		}

		docs = append(docs, doc)

	}

	// Index the document. The API accepts multiple documents at a time
	if err := c.Index(docs...); err != nil {
		log.Fatal(err)
	}

	log.Println("Success")
}
