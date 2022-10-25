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

package repository

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/models"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/util"
)

type AppointmentRepository struct {
}

func (s *AppointmentRepository) SaveAppointment(data models.Appointment) error {
	d := map[string]interface{}{
		"_type": "ORIGINAL_VERSION",
		"contribution": map[string]interface{}{
			"id": map[string]interface{}{
				"_type": "HIER_OBJECT_ID",
				"value": "7c62f3b4-aa5f-4caa-b4d6-9302c08d74de",
			},
			"namespace": "EHR::COMMON",
			"type":      "CONTRIBUTION",
		},
		"name":              util.TemplateName("TensorEMR"),
		"archetype_details": util.TemplateRootArchtype("openEHR-EHR-COMPOSITION.encounter.v1", "TensorEMR"),
		"archetype_node_id": "openEHR-EHR-COMPOSITION.encounter.v1",
		"language":          util.TemplateLanguage("en"),
		"territory":         util.TemplateTerritory("ET"),
		"category":          util.TemplateCategory("event", "433"),
		"context":           util.TemplateContext(time.Now(), "primary medical care", "228"),
		"composer":          util.TemplateComposer("2d2c216e-cc58-4a5b-8852-0de11c91e090", "Dr. Tiliksew"),
		"commit_audit":      util.TemplateCommitAudit("TENSOREMR", data.ProviderID, data.ProviderName, "creation", "249", time.Now()),
		"uid":               util.TemplateUID("f3a50b77-b644-4d16-aff9-389992342435::TENSOREMR-EHRSERVER::1"),
		"content": []map[string]interface{}{
			{
				"_type": "ADMIN_ENTRY",
				"name": map[string]interface{}{
					"_type": "DV_TEXT",
					"value": "appointment",
				},
				"archetype_details": map[string]interface{}{
					"archetype_id": map[string]interface{}{
						"_type": "ARCHETYPE_ID",
						"value": "openEHR-EHR-ADMIN_ENTRY.appointment.v0",
					},
					"template_id": map[string]interface{}{
						"_type": "TEMPLATE_ID",
						"value": "Tensor EMR",
					},
					"rm_version": "1.0.2",
				},
				"archetype_node_id": "openEHR-EHR-ADMIN_ENTRY.appointment.v0",
				"language": map[string]interface{}{
					"terminology_id": map[string]interface{}{
						"_type": "TERMINOLOGY_ID",
						"value": "ISO_639-1",
					},
					"code_string": "en",
				},
				"encoding": map[string]interface{}{
					"terminology_id": map[string]interface{}{
						"_type": "TERMINOLOGY_ID",
						"value": "IANA_character-sets",
					},
					"code_string": "UTF-8",
				},
				"subject": map[string]interface{}{
					"_type": "PARTY_SELF",
				},
				"data": map[string]interface{}{
					"_type": "ITEM_TREE",
					"name": map[string]interface{}{
						"_type": "DV_TEXT",
						"value": "Item tree",
					},
					"archetype_node_id": "at0001",
					"items": []map[string]interface{}{
						{
							"_type": "ELEMENT",
							"name": map[string]interface{}{
								"_type": "DV_TEXT",
								"value": "check_in_time",
							},
							"archetype_node_id": "at0004",
							"value": map[string]interface{}{
								"_type": "DV_DATE_TIME",
								"value": data.CheckInTime,
							},
						},
						{
							"_type": "ELEMENT",
							"name": map[string]interface{}{
								"_type": "DV_TEXT",
								"value": "emergency",
							},
							"archetype_node_id": "at0012",
							"value": map[string]interface{}{
								"_type": "DV_BOOLEAN",
								"value": data.Emergency,
							},
						},
						{
							"_type": "ELEMENT",
							"name": map[string]interface{}{
								"_type": "DV_TEXT",
								"value": "department",
							},
							"archetype_node_id": "at0013",
							"value": map[string]interface{}{
								"_type": "DV_TEXT",
								"value": data.Department,
							},
						},

						{
							"_type": "CLUSTER",
							"name": map[string]interface{}{
								"_type": "DV_TEXT",
								"value": "patient",
							},
							"archetype_node_id": "at0037",
							"items": []map[string]interface{}{
								{
									"_type": "ELEMENT",
									"name": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": "patient_id",
									},
									"archetype_node_id": "at0038",
									"value": map[string]interface{}{
										"_type":    "DV_IDENTIFIER",
										"issuer":   "net.tensorsystems",
										"assigner": "org.healthcare",
										"id":       "2d2c216e-cc58-4a5b-8852-0de11c91e091",
										"type":     "LOCALID",
									},
								},
								{
									"_type": "ELEMENT",
									"name": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": "patient_name",
									},
									"archetype_node_id": "at0040",
									"value": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": data.PatientName,
									},
								},
							},
						},

						{
							"_type": "CLUSTER",
							"name": map[string]interface{}{
								"_type": "DV_TEXT",
								"value": "provider",
							},
							"archetype_node_id": "at0034",
							"items": []map[string]interface{}{
								{
									"_type": "ELEMENT",
									"name": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": "provider_id",
									},
									"archetype_node_id": "at0035",
									"value": map[string]interface{}{
										"_type":    "DV_IDENTIFIER",
										"issuer":   "net.tensorsystems",
										"assigner": "org.healthcare",
										"id":       "2d2c216e-cc58-4a5b-8852-0de11c91e092",
										"type":     "LOCALID",
									},
								},
								{
									"_type": "ELEMENT",
									"name": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": "provider_name",
									},
									"archetype_node_id": "at0036",
									"value": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": data.ProviderName,
									},
								},
							},
						},

						{
							"_type": "CLUSTER",
							"name": map[string]interface{}{
								"_type": "DV_TEXT",
								"value": "room",
							},
							"archetype_node_id": "at0023",
							"items": []map[string]interface{}{
								{
									"_type": "ELEMENT",
									"name": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": "room_id",
									},
									"archetype_node_id": "at0024",
									"value": map[string]interface{}{
										"_type":    "DV_IDENTIFIER",
										"issuer":   "net.tensorsystems",
										"assigner": "org.healthcare",
										"id":       "2d2c216e-cc58-4a5b-8852-0de11c91e093",
										"type":     "LOCALID",
									},
								},
								{
									"_type": "ELEMENT",
									"name": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": "room_title",
									},
									"archetype_node_id": "at0025",
									"value": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": data.RoomName,
									},
								},
							},
						},

						{
							"_type": "CLUSTER",
							"name": map[string]interface{}{
								"_type": "DV_TEXT",
								"value": "appointment_status",
							},
							"archetype_node_id": "at0031",
							"items": []map[string]interface{}{
								{
									"_type": "ELEMENT",
									"name": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": "appointment_status_id",
									},
									"archetype_node_id": "at0032",
									"value": map[string]interface{}{
										"_type":    "DV_IDENTIFIER",
										"issuer":   "net.tensorsystems",
										"assigner": "org.healthcare",
										"id":       "2d2c216e-cc58-4a5b-8852-0de11c91e0904",
										"type":     "LOCALID",
									},
								},
								{
									"_type": "ELEMENT",
									"name": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": "appointment_status_title",
									},
									"archetype_node_id": "at0041",
									"value": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": data.AppointmentStatusTitle,
									},
								},
							},
						},

						{
							"_type": "CLUSTER",
							"name": map[string]interface{}{
								"_type": "DV_TEXT",
								"value": "visit_type",
							},
							"archetype_node_id": "at0026",
							"items": []map[string]interface{}{
								{
									"_type": "ELEMENT",
									"name": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": "visit_type_id",
									},
									"archetype_node_id": "at0027",
									"value": map[string]interface{}{
										"_type":    "DV_IDENTIFIER",
										"issuer":   "net.tensorsystems",
										"assigner": "org.healthcare",
										"id":       "2d2c216e-cc58-4a5b-8852-0de11c91e095",
										"type":     "LOCALID",
									},
								},
								{
									"_type": "ELEMENT",
									"name": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": "visit_type_title",
									},
									"archetype_node_id": "at0028",
									"value": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": data.VisitTypeTitle,
									},
								},
							},
						},

						{
							"_type": "CLUSTER",
							"name": map[string]interface{}{
								"_type": "DV_TEXT",
								"value": "queue",
							},
							"archetype_node_id": "at0017",
							"items": []map[string]interface{}{
								{
									"_type": "ELEMENT",
									"name": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": "queue_id",
									},
									"archetype_node_id": "at0021",
									"value": map[string]interface{}{
										"_type":    "DV_IDENTIFIER",
										"issuer":   "net.tensorsystems",
										"assigner": "org.healthcare",
										"id":       "2d2c216e-cc58-4a5b-8852-0de11c91e096",
										"type":     "LOCALID",
									},
								},
								{
									"_type": "ELEMENT",
									"name": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": "queue_name",
									},
									"archetype_node_id": "at0022",
									"value": map[string]interface{}{
										"_type": "DV_TEXT",
										"value": data.QueueName,
									},
								},
							},
						},
					},
				},
			},
		},
		"lifecycle_state": map[string]interface{}{
			"value": "complete",
			"defining_code": map[string]interface{}{
				"terminology_id": map[string]interface{}{
					"_type": "TERMINOLOGY_ID",
					"value": "openehr",
				},
				"code_string": "532",
			},
		},
	}

	jsonStr, _ := json.Marshal(d)
	fmt.Println(string(jsonStr))

	// postBody, err := json.Marshal(d)

	// if err != nil {
	// 	return err
	// }

	// responseBody := bytes.NewBuffer(postBody)

	// url := os.Getenv("EHRBASE_BASE_URL") + "/ehrbase/rest/openehr/v1/ehr/7d44b88c-4199-4bad-97dc-d78268e01398/composition"

	// fmt.Println(url)
	// client := &http.Client{}

	// req, err := http.NewRequest("POST", url, responseBody)
	// req.Header.Add("Prefer", "return={representation}")
	// req.Header.Add("Content-Type", "application/json")

	// resp, err := client.Do(req)
	// if err != nil {
	// 	log.Println(err)
	// 	return err
	// }

	// defer resp.Body.Close()
	// body, err := io.ReadAll(resp.Body)
	// if err != nil {
	// 	log.Println(err)
	// 	return err
	// }

	// sb := string(body)
	// log.Printf(sb)

	return nil
}

var templateLanguage = map[string]interface{}{
	"terminology_id": map[string]interface{}{
		"_type": "TERMINOLOGY_ID",
		"value": "ISO_639-1",
	},
	"code_string": "en",
}

var templateCategory = map[string]interface{}{
	"value": "event",
	"defining_code": map[string]interface{}{
		"terminology_id": map[string]interface{}{
			"_type": "TERMINOLOGY_ID",
			"value": "openehr",
		},
		"code_string": "433",
	},
}
