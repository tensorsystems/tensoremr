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
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type UserRepository struct {
	DB                 *gorm.DB
	UserTypeRepository UserTypeRepository
}

func ProvideUserRepository(DB *gorm.DB, userTypeRepository UserTypeRepository) UserRepository {
	return UserRepository{DB: DB, UserTypeRepository: userTypeRepository}
}

// Seed ...
func (r *UserRepository) Seed() {
	var userType models.UserType
	r.UserTypeRepository.GetByTitle(&userType, "Admin")

	var user models.User
	user.FirstName = "Admin"
	user.LastName = "Admin"
	user.Email = "info@tensorsystems.net"
	user.UserTypes = append(user.UserTypes, userType)
	user.Password = "changeme"
	user.Active = true
	user.HashPassword()

	r.DB.Create(&user)
}

// Save ...
func (r *UserRepository) Save(m *models.User, userTypes []models.UserType) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&m).Error; err != nil {
			return err
		}

		if userTypes != nil {
			tx.Model(&m).Association("UserTypes").Replace(&userTypes)

			isPhysician := false
			for _, e := range userTypes {
				if e.Title == "Physician" {
					isPhysician = true
				}
			}

			isNurse := false
			for _, e := range userTypes {
				if e.Title == "Nurse" {
					isNurse = true
				}
			}

			if isPhysician {
				var patientEncounterLimit models.PatientEncounterLimit
				patientEncounterLimit.UserID = m.ID
				patientEncounterLimit.MondayLimit = 150
				patientEncounterLimit.TuesdayLimit = 150
				patientEncounterLimit.WednesdayLimit = 150
				patientEncounterLimit.ThursdayLimit = 150
				patientEncounterLimit.FridayLimit = 150
				patientEncounterLimit.SaturdayLimit = 150
				patientEncounterLimit.SundayLimit = 150
				patientEncounterLimit.Overbook = 5

				if err := tx.Create(&patientEncounterLimit).Error; err != nil {
					return err
				}

				queue := datatypes.JSON([]byte("[" + "]"))

				var patientQueue models.PatientQueue
				patientQueue.QueueName = "Dr. " + m.FirstName + " " + m.LastName
				patientQueue.Queue = queue
				patientQueue.QueueType = "USER"

				if err := tx.Create(&patientQueue).Error; err != nil {
					return err
				}

				var queueSubscription models.QueueSubscription
				queueSubscription.UserID = m.ID
				queueSubscription.Subscriptions = append(queueSubscription.Subscriptions, patientQueue)

				if err := tx.Create(&queueSubscription).Error; err != nil {
					return err
				}
			}

			if isNurse {
				var patientQueue models.PatientQueue
				if err := tx.Where("queue_name = ?", "Pre-Exam").Take(&patientQueue).Error; err != nil {
					return err
				}
				var queueSubscription models.QueueSubscription
				queueSubscription.UserID = m.ID
				queueSubscription.Subscriptions = append(queueSubscription.Subscriptions, patientQueue)

				if err := tx.Create(&queueSubscription).Error; err != nil {
					return err
				}
			}
		}

		return nil
	})
}

// Search ...
func (r *UserRepository) SearchPhysicians(searchTerm string) ([]*models.User, error) {
	var result []*models.User

	var userType models.UserType
	if err := r.UserTypeRepository.GetByTitle(&userType, "Physician"); err != nil {
		return nil, err
	}

	if len(searchTerm) > 0 {
		r.DB.Model(&userType).Where("first_name ILIKE ?", "%"+searchTerm+"%").Or("last_name ILIKE ?", "%"+searchTerm+"%").Association("Users").Find(&result)
	}

	return result, nil
}

// GetAll ...
func (r *UserRepository) GetAll(p PaginationInput) ([]models.User, int64, error) {
	var result []models.User

	err := r.DB.Scopes(Paginate(&p)).Select("*, count(*) OVER() AS count").Order("id ASC").Preload("UserTypes").Preload("Signature").Preload("ProfilePic").Find(&result).Error
	if err != nil {
		return result, 0, err
	}

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	return result, count, err
}

// Search ...
func (r *UserRepository) Search(p models.PaginationInput, filter *models.User, searchTerm *string) ([]models.User, int64, error) {
	var result []models.User

	tx := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Order("id ASC").Preload("UserTypes").Preload("Signature").Preload("ProfilePic")

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

// Get ...
func (r *UserRepository) Get(m *models.User, ID int) error {
	return r.DB.Where("id = ?", ID).Preload("Signature").Preload("ProfilePic").Preload("UserTypes").Take(&m).Error
}

// GetByEmail ...
func (r *UserRepository) GetByEmail(m *models.User, email string) error {
	return r.DB.Where("email = ?", email).Preload("UserTypes").Take(&m).Error
}

// GetByOldUserName ...
func (r *UserRepository) GetByOldUserName(m *models.User, userName string) error {
	return r.DB.Where("old_user_name ILIKE ?", userName).Preload("UserTypes").Take(&m).Error
}

// CheckIfUserLegacy ...
func (r *UserRepository) CheckIfUserLegacy(m *models.User, oldUserName string) error {
	return r.DB.Where("old_user_name ILIKE ?", oldUserName).Where("email != ''").Take(&m).Error
}

// GetByUserType ...
func (r *UserRepository) GetByUserType(m *models.User, userTypeID int) (users []models.User, err error) {
	err = r.DB.Where("user_type_id = ?", userTypeID).Find(&users).Error
	return
}

// GetByUserTypeTitle ...
func (r *UserRepository) GetByUserTypeTitle(userTypeTitle string) ([]*models.User, error) {
	var userType models.UserType
	err := r.DB.Model(&models.UserType{}).Where("title = ?", userTypeTitle).Preload("Users").Take(&userType).Error
	if err != nil {
		return nil, err
	}

	var result []*models.User
	for i, v := range userType.Users {
		if v.Active {
			result = append(result, &userType.Users[i])
		}
	}

	return result, err
}

// Update ...
func (r *UserRepository) Update(m *models.User, userTypes []models.UserType) error {
	err := r.DB.Updates(&m).Error
	if err != nil {
		return err
	}

	if err := r.DB.Select("active").Where("id = ?", m.ID).Updates(models.User{Active: m.Active}).Error; err != nil {
		return err
	}

	if userTypes != nil {
		r.DB.Model(&m).Association("UserTypes").Replace(&userTypes)
	}

	return nil
}

// Ping ...
func (r *UserRepository) Ping() error {
	db, err := r.DB.DB()
	if err != nil {
		return err
	}

	return db.Ping()
}
