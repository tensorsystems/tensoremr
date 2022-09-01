# Copyright 2021 Kidus Tiliksew

# This file is part of Tensor EMR.

# Tensor EMR is free software: you can redistribute it and/or modify
# it under the terms of the version 2 of GNU General Public License as published by
# the Free Software Foundation.

# Tensor EMR is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.


curl -X PUT "localhost:9200/postgres.public.patients/_mapping" -H 'Content-Type: application/json' -d'
{
	"properties": {
		"first_name": {
        	"type": "text",
        	"copy_to": "full_name" 
      	},
      	"last_name": {
        	"type": "text",
        	"copy_to": "full_name" 
      	},
      	"full_name": {
        	"type": "text"
      	}
	}
}
'


curl -X PUT "localhost:9200/postgres.public.opthalmology_exams/_mapping" -H 'Content-Type: application/json' -d'
{
	"properties": {
		"right_cover_test": {
      "type": "completion"
    },
    "left_cover_test": {
      "type": "completion"
    },
		"right_orbits": {
      "type": "completion"
    },
		"left_orbits": {
      "type": "completion"
    },
		"right_lids": {
      "type": "completion"
    },
    "left_lids": {
      "type": "completion"
    },
		"right_lacrimal_system": {
      "type": "completion"
    },
    "left_lacrimal_system": {
      "type": "completion"
    },
		"right_retina": {
      "type": "completion"
    },
    "left_retina": {
      "type": "completion"
    },
		"right_ocular_motility": {
      "type": "completion"
    },
    "left_ocular_motility": {
      "type": "completion"
    },
		"right_optic_disc": {
      "type": "completion"
    },
    "left_optic_disc": {
      "type": "completion"
    },
		"right_pupils": {
      "type": "completion"
    },
    "left_pupils": {
      "type": "completion"
    },
		"right_conjunctiva": {
      "type": "completion"
    },
    "left_conjunctiva": {
      "type": "completion"
    },
		"right_cornea": {
      "type": "completion"
    },
    "left_cornea": {
      "type": "completion"
    },
		"right_sclera": {
      "type": "completion"
    },
    "left_sclera": {
      "type": "completion"
    },
		"right_anterior_chamber": {
      "type": "completion"
    },
    "left_anterior_chamber": {
      "type": "completion"
    },
		"right_iris": {
      "type": "completion"
    },
    "left_iris": {
      "type": "completion"
    },
		"right_lens": {
      "type": "completion"
    },
    "left_lens": {
      "type": "completion"
    },
		"right_vitreos": {
      "type": "completion"
    },
    "left_vitreos": {
      "type": "completion"
    }
	}
}
'