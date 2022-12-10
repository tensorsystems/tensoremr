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

type VitalSignsRepository struct {
	DB *gorm.DB
}

func ProvideVitalSignsRepository(DB *gorm.DB) VitalSignsRepository {
	return VitalSignsRepository{DB: DB}
}

// Save ...
func (r *VitalSignsRepository) Save(m *models.VitalSigns) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *VitalSignsRepository) Get(m *models.VitalSigns, filter models.VitalSigns) error {
	return r.DB.Where(filter).Take(&m).Error
}

// GetByPatientChart ...
func (r *VitalSignsRepository) GetByPatientChart(m *models.VitalSigns, ID int) error {
	return r.DB.Where("patient_chart_id = ?", ID).Take(&m).Error
}

// Update ...
func (r *VitalSignsRepository) Update(m *models.VitalSigns) error {
	return r.DB.Updates(&m).Error
}
