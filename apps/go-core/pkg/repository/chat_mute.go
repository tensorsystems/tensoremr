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

type ChatMuteRepository struct {
	DB *gorm.DB
}

func ProvideChatMuteRepository(DB *gorm.DB) ChatMuteRepository {
	return ChatMuteRepository{DB: DB}
}

// Save ...
func (r *ChatMuteRepository) Save(m *models.ChatMute) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *ChatMuteRepository) Get(m *models.ChatMute, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// Update ...
func (r *ChatMuteRepository) Update(m *models.ChatMute) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *ChatMuteRepository) Delete(userID int, chatID int) error {
	return r.DB.Where("user_id = ? AND chat_id = ?", userID, chatID).Delete(&models.ChatMute{}).Error
}
