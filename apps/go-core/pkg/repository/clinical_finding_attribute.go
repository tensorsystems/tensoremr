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

type ClinicalFindingAttributeRepository struct {
	DB *gorm.DB
}

func ProvideClinicalFindingAttributeRepository(DB *gorm.DB) ClinicalFindingAttributeRepository {
	return ClinicalFindingAttributeRepository{DB: DB}
}

// Save ...
func (r *ClinicalFindingAttributeRepository) Save(m *models.ClinicalFindingAttribute) error {
	return r.DB.Create(&m).Error
}

// Save ...
func (r *ClinicalFindingAttributeRepository) SaveBatch(m []models.ClinicalFindingAttribute) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *ClinicalFindingAttributeRepository) Get(m *models.ClinicalFindingAttribute, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetAll ...
func (r *ClinicalFindingAttributeRepository) GetAll(p models.PaginationInput, filter *models.ClinicalFindingAttribute) ([]models.ClinicalFindingAttribute, int64, error) {
	var result []models.ClinicalFindingAttribute

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Preload("Attributes").Where(filter).Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// GetByTitle ...
func (r *ClinicalFindingAttributeRepository) GetByTitle(m *models.ClinicalFindingAttribute, title string) error {
	return r.DB.Where("title = ?", title).Take(&m).Error
}

// Update ...
func (r *ClinicalFindingAttributeRepository) Update(m *models.ClinicalFindingAttribute) error {
	return r.DB.Updates(&m).Error
}

// UpdateByConceptId ...
func (r *ClinicalFindingAttributeRepository) UpdateByConceptId(conceptID string, m *models.ClinicalFindingAttribute) error {
	return r.DB.Where("concept_id = ?", conceptID).Updates(&m).Error
}

// Delete ...
func (r *ClinicalFindingAttributeRepository) Delete(ID int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ?", ID).Delete(&models.ClinicalFindingAttribute{}).Error; err != nil {
			return err
		}

		if err := tx.Where("clinical_finding_id = ?", ID).Delete(&models.ClinicalFindingAttribute{}).Error; err != nil {
			return err
		}

		return nil
	})
}

// Delete ...
func (r *ClinicalFindingAttributeRepository) DeleteByConceptId(conceptID string) error {
	return r.DB.Model(&models.ClinicalFindingAttribute{}).Where("concept_id = ?", conceptID).Error
}
