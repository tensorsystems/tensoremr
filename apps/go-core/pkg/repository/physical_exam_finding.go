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

type PhysicalExamFindingRepository struct {
	DB *gorm.DB
}

func ProvidePhysicalExamFindingRepository(DB *gorm.DB) PhysicalExamFindingRepository {
	return PhysicalExamFindingRepository{DB: DB}
}

// Save ...
func (r *PhysicalExamFindingRepository) Save(m *models.PhysicalExamFinding) error {
	return r.DB.Create(&m).Error
}

// GetAll ...
func (r *PhysicalExamFindingRepository) GetAll(p models.PaginationInput, filter *models.PhysicalExamFinding) ([]models.PhysicalExamFinding, int64, error) {
	var result []models.PhysicalExamFinding

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Preload("ExamCategory").Where(filter).Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// Get ...
func (r *PhysicalExamFindingRepository) Get(m *models.PhysicalExamFinding, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByTitle ...
func (r *PhysicalExamFindingRepository) GetByPatientChartID(m *models.PhysicalExamFinding, id string) error {
	return r.DB.Where("patient_chart_id = ?", id).Take(&m).Error
}

// Update ...
func (r *PhysicalExamFindingRepository) Update(m *models.PhysicalExamFinding) error {
	return r.DB.Save(&m).Error
}

// Delete ...
func (r *PhysicalExamFindingRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.PhysicalExamFinding{}).Error
}

// DeleteExamCategory
func (r *PhysicalExamFindingRepository) DeleteExamCategory(m *models.PhysicalExamFinding, physicalExamFindingID int, examCategoryID int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ?", physicalExamFindingID).Take(&m).Error; err != nil {
			return err
		}

		var examCategory models.ExamCategory
		if err := tx.Where("id = ?", examCategoryID).Take(&examCategory).Error; err != nil {
			return err
		}

		tx.Model(&m).Where("id = ?", physicalExamFindingID).Association("ExamCategory").Delete(&examCategory)

		return nil
	})
}
