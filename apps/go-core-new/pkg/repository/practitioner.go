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
	"fmt"
	"time"
)

type PractitionerRepository struct{}

func (s *PractitionerRepository) SavePractitioner(data map[string]interface{}) error {
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
		"name": map[string]interface{}{
			"value": "practitioner",
		},
		"archetype_details": map[string]interface{}{
			"archetype_id": map[string]interface{}{
				"_type": "ARCHETYPE_ID",
				"value": "openEHR-EHR-COMPOSITION.practitioner.v0",
			},
			"template_id": map[string]interface{}{
				"_type": "TEMPLATE_ID",
				"value": "practitioner",
			},
			"rm_version": "1.0.2",
		},
		"archetype_node_id": "openEHR-EHR-COMPOSITION.practitioner.v0",
		"language": map[string]interface{}{
			"terminology_id": map[string]interface{}{
				"_type": "TERMINOLOGY_ID",
				"value": "ISO_639-1",
			},
			"code_string": "en",
		},
		"territory": map[string]interface{}{
			"terminology_id": map[string]interface{}{
				"_type": "TERMINOLOGY_ID",
				"value": "ISO_3166-1",
			},
			"code_string": "UY",
		},
		"category": map[string]interface{}{
			"value": "event",
			"defining_code": map[string]interface{}{
				"terminology_id": map[string]interface{}{
					"_type": "TERMINOLOGY_ID",
					"value": "openehr",
				},
				"code_string": "433",
			},
		},
		"context": map[string]interface{}{
			"start_time": map[string]interface{}{
				"value": time.Now(),
			},
			"setting": map[string]interface{}{
				"value": "primary medical care",
				"defining_code": map[string]interface{}{
					"terminology_id": map[string]interface{}{
						"_type": "TERMINOLOGY_ID",
						"value": "openehr",
					},
					"code_string": "228",
				},
			},
		},
		"commit_audit": map[string]interface{}{
			"system_id": "TENSOREMR",
			"committer": map[string]interface{}{
				"_type": "PARTY_IDENTIFIED",
				"external_ref": map[string]interface{}{
					"id": map[string]interface{}{
						"_type": "HIER_OBJECT_ID",
						"value": "",
					},
					"namespace": "DEMOGRAPHIC",
					"type":      "PERSON",
				},
				"name": "",
			},
			"time_committed": map[string]interface{}{
				"value": time.Now(),
			},
			"change_type": map[string]interface{}{
				"value": "creation",
				"defining_code": map[string]interface{}{
					"terminology_id": map[string]interface{}{
						"_type": "TERMINOLOGY_ID",
						"value": "openehr",
					},
					"code_string": "249",
				},
			},
		},
		"uid": map[string]interface{}{
			"_type": "OBJECT_VERSION_ID",
			"value": "f3a50b77-b644-4d16-aff9-389992342435::TENSOREMR-EHRSERVER::1",
		},
		"content": []map[string]interface{}{
			{
				"_type": "ADMIN_ENTRY",
			},
		},
	}

	fmt.Println(d)

	return nil
}
