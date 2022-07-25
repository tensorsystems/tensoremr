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

type ChatRepository struct {
	DB *gorm.DB
}

func ProvideChatRepository(DB *gorm.DB) ChatRepository {
	return ChatRepository{DB: DB}
}

// Save ...
func (r *ChatRepository) Save(m *models.Chat) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *ChatRepository) Get(m *models.Chat, ID int) error {
	return r.DB.Where("id = ?", ID).Preload("ChatMembers").Take(&m).Error
}

// GetUserChats ...
func (r *ChatRepository) GetUserChats(userID int) ([]*models.Chat, error) {
	var chats []*models.Chat
	err := r.DB.Joins("inner join chat_members on chat_members.chat_id = chats.id").Where("chat_members.user_id = ?", userID).Order("updated_at desc").Preload("ChatMembers").Preload("ChatMutes").Preload("ChatUnreadMessages").Find(&chats).Error
	return chats, err
}

// Update ...
func (r *ChatRepository) Update(m *models.Chat) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *ChatRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.Chat{}).Error
}
