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
	"errors"

	"github.com/lib/pq"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	"gorm.io/gorm"
)

type RoomRepository struct {
	DB *gorm.DB
}

func ProvideRoomRepository(DB *gorm.DB) RoomRepository {
	return RoomRepository{DB: DB}
}

// Seed ...
func (r *RoomRepository) Seed() {
	r.DB.Create(&models.Room{Title: "Exam Room 1"})
	r.DB.Create(&models.Room{Title: "Exam Room 1"})
	r.DB.Create(&models.Room{Title: "Exam Room 1"})
}

// Save ...
func (r *RoomRepository) Save(m *models.Room) error {
	err := r.DB.Create(&m).Error

	if err, ok := err.(*pq.Error); ok && err.Code.Name() == "unique_violation" {
		var existing models.Room
		existingErr := r.DB.Unscoped().Where("title = ?", m.Title).Take(&existing).Error

		if existingErr == nil {
			r.DB.Model(&models.Room{}).Unscoped().Where("id = ?", existing.ID).Update("deleted_at", nil)
			m = &existing
			return nil
		}

		return errors.New("Duplicate, " + err.Detail)
	}

	if err != nil {
		return err
	}

	return nil
}

// Get ...
func (r *RoomRepository) Get(m *models.Room, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByTitle ...
func (r *RoomRepository) GetByTitle(m *models.Room, title string) error {
	return r.DB.Where("title = ?", title).Take(&m).Error
}

// Update ...
func (r *RoomRepository) Update(m *models.Room) error {
	err := r.DB.Save(&m).Error

	if err, ok := err.(*pq.Error); ok && err.Code.Name() == "unique_violation" {
		return errors.New("Duplicate, " + err.Detail)
	}

	return nil
}

// Delete ...
func (r *RoomRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.Room{}).Error
}

// GetAll ...
func (r *RoomRepository) GetAll(p models.PaginationInput) ([]models.Room, int64, error) {
	var result []models.Room

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
