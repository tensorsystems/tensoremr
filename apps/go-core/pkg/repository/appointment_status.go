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

type AppointmentStatusRepository struct {
	DB *gorm.DB
}

func ProvideAppointmentStatusRepository(DB *gorm.DB) AppointmentStatusRepository {
	return AppointmentStatusRepository{DB: DB}
}

//Seed ...
func (r *AppointmentStatusRepository) Seed() {
	r.DB.Create(&models.AppointmentStatus{Title: "Scheduled"})
	r.DB.Create(&models.AppointmentStatus{Title: "Checked-In"})
	r.DB.Create(&models.AppointmentStatus{Title: "Checked-Out"})
	r.DB.Create(&models.AppointmentStatus{Title: "Cancelled"})
}

// Save ...
func (r *AppointmentStatusRepository) Save(m *models.AppointmentStatus) error {
	return r.DB.Create(&m).Error
}

// GetAll ...
func (r *AppointmentStatusRepository) GetAll(p models.PaginationInput) ([]models.AppointmentStatus, int64, error) {
	var result []models.AppointmentStatus

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
func (r *AppointmentStatusRepository) Get(m *models.AppointmentStatus, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByTitle ...
func (r *AppointmentStatusRepository) GetByTitle(m *models.AppointmentStatus, title string) error {
	return r.DB.Where("title = ?", title).Take(&m).Error
}

// Update ...
func (r *AppointmentStatusRepository) Update(m *models.AppointmentStatus) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *AppointmentStatusRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.AppointmentStatus{}).Error
}
