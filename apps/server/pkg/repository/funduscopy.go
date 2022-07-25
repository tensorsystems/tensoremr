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
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	"gorm.io/gorm"
)

type FunduscopyRepository struct {
	DB *gorm.DB
}

func ProvideFunduscopyRepository(DB *gorm.DB) FunduscopyRepository {
	return FunduscopyRepository{DB: DB}
}

// Save ...
func (r *FunduscopyRepository) Save(m *models.Funduscopy) error {
	return r.DB.Create(&m).Error
}

// SaveForPatientChart ...
func (r *FunduscopyRepository) SaveForPatientChart(m *models.Funduscopy) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var existing models.Funduscopy
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
func (r *FunduscopyRepository) Get(m *models.Funduscopy, filter models.Funduscopy) error {
	return r.DB.Where(filter).Take(&m).Error
}

// GetByPatientChart ...
func (r *FunduscopyRepository) GetByPatientChart(m *models.Funduscopy, ID int) error {
	return r.DB.Where("patient_chart_id = ?", ID).Take(&m).Error
}

// Update ...
func (r *FunduscopyRepository) Update(m *models.Funduscopy) error {
	return r.DB.Updates(&m).Error
}
