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

type UserTypeRepository struct {
	DB *gorm.DB
}

func ProvideUserTypeRepository(DB *gorm.DB) UserTypeRepository {
	return UserTypeRepository{DB: DB}
}

// Seed ...
func (r *UserTypeRepository) Seed() {
	r.DB.Create(&models.UserType{Title: "Admin"})
	r.DB.Create(&models.UserType{Title: "Nurse"})
	r.DB.Create(&models.UserType{Title: "Pharmacist"})
	r.DB.Create(&models.UserType{Title: "Optical Assistant"})
	r.DB.Create(&models.UserType{Title: "Physician"})
	r.DB.Create(&models.UserType{Title: "Optometrist"})
	r.DB.Create(&models.UserType{Title: "Receptionist"})
}

// Save ...
func (r *UserTypeRepository) Save(m *models.UserType) error {
	return r.DB.Create(&m).Error
}

// GetAll ...
func (r *UserTypeRepository) GetAll(p models.PaginationInput) ([]models.UserType, int64, error) {
	var result []models.UserType

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Order("id ASC").Find(&result)

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
func (r *UserTypeRepository) Get(m *models.UserType, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// Update ...
func (r *UserTypeRepository) Update(m *models.UserType) error {
	return r.DB.Save(&m).Error
}

// Delete ...
func (r *UserTypeRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.UserType{}).Error
}

// GetByTitle ...
func (r *UserTypeRepository) GetByTitle(m *models.UserType, title string) error {
	return r.DB.Where("title = ?", title).Take(&m).Error
}

// GetByIds
func (r *UserTypeRepository) GetByIds(ids []*int) ([]models.UserType, error) {
	var result []models.UserType
	err := r.DB.Where("id IN ?", ids).Find(&result).Error
	return result, err
}
