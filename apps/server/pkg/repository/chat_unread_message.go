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

type ChatUnreadRepository struct {
	DB *gorm.DB
}

func ProvideChatUnreadRepository(DB *gorm.DB) ChatUnreadRepository {
	return ChatUnreadRepository{DB: DB}
}

// Save ...
func (r *ChatUnreadRepository) Save(m *models.ChatUnreadMessage) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *ChatUnreadRepository) Get(m *models.ChatUnreadMessage, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByUserID ...
func (r *ChatUnreadRepository) GetByUserID(ID int) ([]*models.ChatUnreadMessage, error) {
	var unreadMessages []*models.ChatUnreadMessage
	err := r.DB.Where("user_id = ?", ID).Find(&unreadMessages).Error
	return unreadMessages, err
}

// Update ...
func (r *ChatUnreadRepository) Update(m *models.ChatUnreadMessage) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *ChatUnreadRepository) Delete(m *models.ChatUnreadMessage, ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&m).Error
}

// Delete ...
func (r *ChatUnreadRepository) DeleteForUserChat(userID int, chatID int) error {
	return r.DB.Where("user_id = ? AND chat_id = ?", userID, chatID).Delete(&models.ChatUnreadMessage{}).Error
}
