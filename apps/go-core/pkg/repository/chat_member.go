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

type ChatMemberRepository struct {
	DB *gorm.DB
}

func ProvideChatMemberRepository(DB *gorm.DB) ChatMemberRepository {
	return ChatMemberRepository{DB: DB}
}

// Save ...
func (r *ChatMemberRepository) Save(m *models.ChatMember) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *ChatMemberRepository) Get(m *models.ChatMember, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// FindCommonChatID ...
func (r *ChatMemberRepository) FindCommonChatID(userID int, recipientID int) (int, error) {
	var chatMemeber models.ChatMember
	err := r.DB.Select("chat_id").Where("user_id = ? or user_id = ?", userID, recipientID).Group("chat_id").Having("count(chat_id) > ?", 1).Order("chat_id desc").Take(&chatMemeber).Error

	if err != nil {

		return 0, nil
	}

	return chatMemeber.ChatID, nil
}

// GetByChatID ...
func (r *ChatMemberRepository) GetByChatID(ID int) ([]*models.ChatMember, error) {
	var members []*models.ChatMember
	err := r.DB.Where("chat_id = ?", ID).Order("created_at desc").Find(&members).Error
	return members, err
}

// Update ...
func (r *ChatMemberRepository) Update(m *models.ChatMember) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *ChatMemberRepository) Delete(userID int, chatID int) error {
	return r.DB.Where("user_id = ? AND chat_id = ?", userID, chatID).Delete(&models.ChatMember{}).Error
}
