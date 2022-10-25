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

package util

import "time"

func TemplateName(value string) map[string]interface{} {
	return map[string]interface{}{
		"_type": "DV_TEXT",
		"value": value,
	}
}

func TemplateRootArchtype(archetypeID, templateID string) map[string]interface{} {
	return map[string]interface{}{
		"archetype_id": map[string]interface{}{
			"_type": "ARCHETYPE_ID",
			"value": archetypeID,
		},
		"template_id": map[string]interface{}{
			"_type": "TEMPLATE_ID",
			"value": templateID,
		},
		"rm_version": "1.0.2",
	}
}

func TemplateLanguage(language string) map[string]interface{} {
	return map[string]interface{}{
		"terminology_id": map[string]interface{}{
			"_type": "TERMINOLOGY_ID",
			"value": "ISO_639-1",
		},
		"code_string": language,
	}
}

func TemplateTerritory(territory string) map[string]interface{} {
	return map[string]interface{}{
		"terminology_id": map[string]interface{}{
			"_type": "TERMINOLOGY_ID",
			"value": "ISO_3166-1",
		},
		"code_string": territory,
	}
}

func TemplateCategory(value, code string) map[string]interface{} {
	return map[string]interface{}{
		"value": value,
		"defining_code": map[string]interface{}{
			"terminology_id": map[string]interface{}{
				"_type": "TERMINOLOGY_ID",
				"value": "openehr",
			},
			"code_string": code,
		},
	}
}

func TemplateContext(startTime time.Time, settingValue string, settingCode string) map[string]interface{} {
	return map[string]interface{}{
		"start_time": map[string]interface{}{
			"value": startTime,
		},
		"setting": map[string]interface{}{
			"value": settingValue,
			"defining_code": map[string]interface{}{
				"terminology_id": map[string]interface{}{
					"_type": "TERMINOLOGY_ID",
					"value": "openehr",
				},
				"code_string": settingCode,
			},
		},
	}
}

func TemplateComposer(id string, name string) map[string]interface{} {
	return map[string]interface{}{
		"_type": "PARTY_IDENTIFIED",
		"external_ref": map[string]interface{}{
			"id": map[string]interface{}{
				"_type": "HIER_OBJECT_ID",
				"value": id,
			},
			"namespace": "DEMOGRAPHIC",
			"type":      "PERSON",
		},
		"name": name,
	}
}

func TemplateCommitAudit(systemId, providerId, providerName, changeTypeValue, changeTypeCode string, timeCommitted time.Time) map[string]interface{} {
	return map[string]interface{}{
		"system_id": systemId,
		"committer": map[string]interface{}{
			"_type": "PARTY_IDENTIFIED",
			"external_ref": map[string]interface{}{
				"id": map[string]interface{}{
					"_type": "HIER_OBJECT_ID",
					"value": providerId,
				},
				"namespace": "DEMOGRAPHIC",
				"type":      "PERSON",
			},
			"name": providerName,
		},
		"time_committed": map[string]interface{}{
			"value": timeCommitted,
		},
		"change_type": map[string]interface{}{
			"value": changeTypeValue,
			"defining_code": map[string]interface{}{
				"terminology_id": map[string]interface{}{
					"_type": "TERMINOLOGY_ID",
					"value": "openehr",
				},
				"code_string": changeTypeCode,
			},
		},
	}
}

func TemplateUID(value string) map[string]interface{} {
	return map[string]interface{}{
		"_type": "OBJECT_VERSION_ID",
		"value": value,
	}
}
