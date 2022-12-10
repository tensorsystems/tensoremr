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

type ChatDeleteRepository struct {
	DB *gorm.DB
}

func ProvideChatDeleteRepository(DB *gorm.DB) ChatDeleteRepository {
	return ChatDeleteRepository{DB: DB}
}

// Save ...
func (r *ChatDeleteRepository) Save(m *models.ChatDelete) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *ChatDeleteRepository) Get(m *models.ChatDelete, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// Update ...
func (r *ChatDeleteRepository) Update(m *models.ChatDelete) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *ChatDeleteRepository) Delete(userID int, chatID int) error {
	return r.DB.Where("user_id = ? AND chat_id = ?", userID, chatID).Delete(&models.ChatDelete{}).Error
}
