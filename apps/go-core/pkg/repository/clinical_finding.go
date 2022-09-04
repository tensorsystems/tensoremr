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

type ClinicialFindingRepository struct {
	DB *gorm.DB
}

func ProvideClinicalFindingRepository(DB *gorm.DB) ClinicialFindingRepository {
	return ClinicialFindingRepository{DB: DB}
}

// Save ...
func (r *ClinicialFindingRepository) Save(m *models.ClinicalFinding) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *ClinicialFindingRepository) Get(m *models.ClinicalFinding, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByTitle ...
func (r *ClinicialFindingRepository) GetByTitle(m *models.ClinicalFinding, title string) error {
	return r.DB.Where("title = ?", title).Take(&m).Error
}

// Update ...
func (r *ClinicialFindingRepository) Update(m *models.ClinicalFinding) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *ClinicialFindingRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.ClinicalFinding{}).Error
}
