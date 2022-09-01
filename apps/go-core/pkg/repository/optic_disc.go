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
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	"gorm.io/gorm"
)

type OpticDiscRepository struct {
	DB *gorm.DB
}

func ProvideOpticDiscRepository(DB *gorm.DB) OpticDiscRepository {
	return OpticDiscRepository{DB: DB}
}

// Save ...
func (r *OpticDiscRepository) Save(m *models.OpticDisc) error {
	return r.DB.Create(&m).Error
}

// SaveForPatientChart ...
func (r *OpticDiscRepository) SaveForPatientChart(m *models.OpticDisc) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var existing models.OpticDisc
		existingErr := tx.Where("patient_chart_id = ?", m.PatientChartID).Take(&existing).Error

		if existingErr != nil {
			if err := tx.Create(&m).Error; err != nil {
				return err
			}
		} else {
			m.ID = existing.ID
			if err := tx.Updates(&m).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

// Get ...
func (r *OpticDiscRepository) Get(m *models.OpticDisc, filter models.OpticDisc) error {
	return r.DB.Where(filter).Take(&m).Error
}

// GetByPatientChart ...
func (r *OpticDiscRepository) GetByPatientChart(m *models.OpticDisc, ID int) error {
	return r.DB.Where("patient_chart_id = ?", ID).Take(&m).Error
}

// Update ...
func (r *OpticDiscRepository) Update(m *models.OpticDisc) error {
	return r.DB.Updates(&m).Error
}
