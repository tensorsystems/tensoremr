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

type DiagnosticProcedureRepository struct {
	DB *gorm.DB
}

func ProvideDiagnosticProcedureRepository(DB *gorm.DB) DiagnosticProcedureRepository {
	return DiagnosticProcedureRepository{DB: DB}
}

// Save ...
func (r *DiagnosticProcedureRepository) Save(m *models.DiagnosticProcedure) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *DiagnosticProcedureRepository) Get(m *models.DiagnosticProcedure, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetWithPayments ...
func (r *DiagnosticProcedureRepository) GetWithPayments(m *models.DiagnosticProcedure, ID int) error {
	return r.DB.Where("id = ?", ID).Preload("Payments").Take(&m).Error
}

// GetRefraction ...
func (r *DiagnosticProcedureRepository) GetRefraction(m *models.DiagnosticProcedure, patientChartID int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var diagnosticProcedureType models.DiagnosticProcedure
		if err := tx.Where("id = ?", "4").Take(&diagnosticProcedureType).Error; err != nil {
			return err
		}

		if err := tx.Where("is_refraction = ?", true).Where("patient_chart_id = ?", patientChartID).Take(&m).Error; err != nil {
			return err
		}

		return nil
	})
}

// GetAll ...
func (r *DiagnosticProcedureRepository) GetAll(p models.PaginationInput, filter *models.DiagnosticProcedure) ([]models.DiagnosticProcedure, int64, error) {
	var result []models.DiagnosticProcedure

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("DiagnosticProcedureType").Preload("Images").Preload("RightEyeImages").Preload("LeftEyeImages").Preload("RightEyeSketches").Preload("LeftEyeSketches").Preload("Documents").Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// Update ...
func (r *DiagnosticProcedureRepository) Update(m *models.DiagnosticProcedure) error {
	return r.DB.Updates(&m).Preload("Images").Preload("Documents").Error
}

// DeleteFile ...
func (r *DiagnosticProcedureRepository) DeleteFile(association string, diagnosticProcedureID int, fileID int) error {
	return r.DB.Model(&models.DiagnosticProcedure{ID: diagnosticProcedureID}).Association(association).Delete(&models.File{ID: fileID})
}

// ClearAssociation ...
func (r *DiagnosticProcedureRepository) ClearAssociation(association string, diagnosticProcedureID int) error {
	return r.DB.Model(&models.DiagnosticProcedure{ID: diagnosticProcedureID}).Association(association).Clear()
}

// Delete ...
func (r *DiagnosticProcedureRepository) Delete(ID int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var diagnosticProcedure models.DiagnosticProcedure
		if err := tx.Where("id = ?", ID).Take(&diagnosticProcedure).Error; err != nil {
			return err
		}

		if err := tx.Where("id = ?", ID).Delete(&diagnosticProcedure).Error; err != nil {
			return err
		}

		var diagnosticProceduresCount int64
		if err := tx.Model(&diagnosticProcedure).Where("diagnostic_procedure_order_id = ?", diagnosticProcedure.DiagnosticProcedureOrderID).Count(&diagnosticProceduresCount).Error; err != nil {
			return err
		}

		if diagnosticProceduresCount == 0 {
			if err := tx.Where("id = ?", diagnosticProcedure.DiagnosticProcedureOrderID).Delete(&models.DiagnosticProcedureOrder{}).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

// GetByPatientChartID ...
func (r *DiagnosticProcedureRepository) GetByPatientChartID(m *models.DiagnosticProcedure, ID int) error {
	return r.DB.Where("patient_chart_id = ?", ID).Take(&m).Error
}
