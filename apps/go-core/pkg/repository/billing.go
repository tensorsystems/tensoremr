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

type BillingRepository struct {
	DB *gorm.DB
}

func ProvideBillingRepository(DB *gorm.DB) BillingRepository {
	return BillingRepository{DB: DB}
}

// Seed ...
func (r *BillingRepository) Seed() {
	r.DB.Create(&models.Billing{Item: "Consultation", Code: "001", Price: 100, Credit: false, Remark: ""})
}

// Save ...
func (r *BillingRepository) Save(m *models.Billing) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *BillingRepository) Get(m *models.Billing, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByIds ...
func (r *BillingRepository) GetByIds(ids []*int) ([]models.Billing, error) {
	var result []models.Billing

	err := r.DB.Where("id IN ?", ids).Find(&result).Error

	if err != nil {
		return result, err
	}

	return result, nil
}

// GetAll ...
func (r *BillingRepository) GetAll(p PaginationInput) ([]models.Billing, int64, error) {
	var result []models.Billing

	dbOp := r.DB.Scopes(Paginate(&p)).Select("*, count(*) OVER() AS count").Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// GetConsultationBillings ...
func (r *BillingRepository) GetConsultationBillings() ([]*models.Billing, error) {
	var result []*models.Billing

	err := r.DB.Where("item ILIKE ?", "%Consultation%").Find(&result).Error

	if err != nil {
		return result, err
	}

	return result, err
}

// Search ...
func (r *BillingRepository) Search(p models.PaginationInput, filter *models.Billing, searchTerm *string) ([]models.Billing, int64, error) {
	var result []models.Billing

	tx := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Order("id ASC")

	if searchTerm != nil {
		tx.Where("document @@ plainto_tsquery(?)", *searchTerm)
	}

	err := tx.Find(&result).Error

	if err != nil {
		return result, 0, err
	}

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	return result, count, err
}

// Update ...
func (r *BillingRepository) Update(m *models.Billing) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *BillingRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.Billing{}).Error
}
