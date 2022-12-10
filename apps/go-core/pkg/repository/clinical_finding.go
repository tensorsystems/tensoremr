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

// Save ...
func (r *ClinicialFindingRepository) SaveBatch(m []models.ClinicalFinding) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *ClinicialFindingRepository) Get(m *models.ClinicalFinding, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetAll ...
func (r *ClinicialFindingRepository) GetAll(p models.PaginationInput, filter *models.ClinicalFinding) ([]models.ClinicalFinding, int64, error) {
	var result []models.ClinicalFinding

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

// GetPastDisorders ...
func (r *ClinicialFindingRepository) GetPastDisorders(p models.PaginationInput, filter *models.ClinicalFinding) ([]models.ClinicalFinding, int64, error) {
	var result []models.ClinicalFinding

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Preload("Attributes").Where(filter).Where(r.DB.Where("parent_concept_id = ?", "312850006").Or("parent_concept_id = ?", "443508001")).Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// GetSurgicalHistory ...
func (r *ClinicialFindingRepository) GetSurgicalHistory(p models.PaginationInput, filter *models.ClinicalFinding) ([]models.ClinicalFinding, int64, error) {
	var result []models.ClinicalFinding

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Preload("Attributes").Where(filter).Where("parent_concept_id = ?", "387713003").Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// GetMentalHistory ...
func (r *ClinicialFindingRepository) GetMentalHistory(p models.PaginationInput, filter *models.ClinicalFinding) ([]models.ClinicalFinding, int64, error) {
	var result []models.ClinicalFinding

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Preload("Attributes").Where(filter).Where("parent_concept_id = ?", "36456004").Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// GetImmunizationHistory ...
func (r *ClinicialFindingRepository) GetImmunizationHistory(p models.PaginationInput, filter *models.ClinicalFinding) ([]models.ClinicalFinding, int64, error) {
	var result []models.ClinicalFinding

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Preload("Attributes").Where(filter).Where("parent_concept_id = ?", "127785005").Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// GetAllergyHistory ...
func (r *ClinicialFindingRepository) GetAllergyHistory(p models.PaginationInput, filter *models.ClinicalFinding) ([]models.ClinicalFinding, int64, error) {
	var result []models.ClinicalFinding

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Preload("Attributes").Where(filter).Where("parent_concept_id = ?", "473011001").Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// GetIntoleranceHistory ...
func (r *ClinicialFindingRepository) GetIntoleranceHistory(p models.PaginationInput, filter *models.ClinicalFinding) ([]models.ClinicalFinding, int64, error) {
	var result []models.ClinicalFinding

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Preload("Attributes").Where(filter).Where("parent_concept_id = ?", "782197009").Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// GetHospitalizationHistory ...
func (r *ClinicialFindingRepository) GetHospitalizationHistory(p models.PaginationInput, filter *models.ClinicalFinding) ([]models.ClinicalFinding, int64, error) {
	var result []models.ClinicalFinding

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Preload("Attributes").Where(filter).Where("parent_concept_id = ?", "32485007").Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// GetClinicalFindingHistory ...
func (r *ClinicialFindingRepository) GetClinicalFindingHistory(p models.PaginationInput, filter *models.ClinicalFinding) ([]models.ClinicalFinding, int64, error) {
	var result []models.ClinicalFinding

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Preload("Attributes").Where(filter).Where("parent_concept_id = ?", "417662000").Order("id ASC").Find(&result)

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
func (r *ClinicialFindingRepository) GetByTitle(m *models.ClinicalFinding, title string) error {
	return r.DB.Where("title = ?", title).Take(&m).Error
}

// Update ...
func (r *ClinicialFindingRepository) Update(m *models.ClinicalFinding) error {
	return r.DB.Updates(&m).Error
}

// UpdateByConceptId ...
func (r *ClinicialFindingRepository) UpdateByConceptId(conceptID string, m *models.ClinicalFinding) error {
	return r.DB.Where("concept_id = ?", conceptID).Updates(&m).Error
}

// Delete ...
func (r *ClinicialFindingRepository) Delete(ID int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ?", ID).Delete(&models.ClinicalFinding{}).Error; err != nil {
			return err
		}

		if err := tx.Where("clinical_finding_id = ?", ID).Delete(&models.ClinicalFindingAttribute{}).Error; err != nil {
			return err
		}

		return nil
	})
}

// Delete ...
func (r *ClinicialFindingRepository) DeleteByConceptId(conceptID string) error {
	return r.DB.Model(&models.ClinicalFinding{}).Where("concept_id = ?", conceptID).Error
}
