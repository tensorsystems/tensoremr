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

type QueueDestinationRepository struct {
	DB *gorm.DB
}

func ProvideQueueDestinationRepository(DB *gorm.DB) QueueDestinationRepository {
	return QueueDestinationRepository{DB: DB}
}

// Seed ...
func (r *QueueDestinationRepository) Seed() {
	r.DB.Create(&models.QueueDestination{Title: "Front Desk"})
	r.DB.Create(&models.QueueDestination{Title: "Exam Room"})
	r.DB.Create(&models.QueueDestination{Title: "Operating Room"})
	r.DB.Create(&models.QueueDestination{Title: "Emergency Room"})
	r.DB.Create(&models.QueueDestination{Title: "Pre-Exam"})
	r.DB.Create(&models.QueueDestination{Title: "Optometry"})
}

// Save ...
func (r *QueueDestinationRepository) Save(m *models.QueueDestination) error {
	return r.DB.Create(&m).Error
}

// GetAll ...
func (r *QueueDestinationRepository) GetAll(p PaginationInput) ([]models.QueueDestination, int64, error) {
	var result []models.QueueDestination

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

// Get ...
func (r *QueueDestinationRepository) Get(m *models.QueueDestination, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// Update ...
func (r *QueueDestinationRepository) Update(m *models.QueueDestination) error {
	return r.DB.Save(&m).Error
}

// Delete ...
func (r *QueueDestinationRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.QueueDestination{}).Error
}

// GetByTitle ...
func (r *QueueDestinationRepository) GetByTitle(m *models.QueueDestination, title string) error {
	return r.DB.Where("title = ?", title).Take(&m).Error
}

// GetUserTypeFromDestination ...
func (r *QueueDestinationRepository) GetUserTypeFromDestination(destination string) string {
	if destination == "PRE_EXAM" {
		return "Nurse"
	}

	if destination == "OPTOMETRY" {
		return "Optometrist"
	}

	if destination == "EXAM_ROOM" {
		return "Physician"
	}

	if destination == "OPERATING_ROOM" {
		return "Physician"
	}

	if destination == "DIAGNOSTIC_PROCEDURE" {
		return "Nurse"
	}

	return ""
}
