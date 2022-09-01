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

type ChatMessageRepository struct {
	DB *gorm.DB
}

func ProvideChatMessageRepository(DB *gorm.DB) ChatMessageRepository {
	return ChatMessageRepository{DB: DB}
}

// Save ...
func (r *ChatMessageRepository) Save(m *models.ChatMessage) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *ChatMessageRepository) Get(m *models.ChatMessage, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByChatID ...
func (r *ChatMessageRepository) GetByChatID(ID int) ([]*models.ChatMessage, error) {
	var messages []*models.ChatMessage
	err := r.DB.Where("chat_id = ?", ID).Order("created_at asc").Find(&messages).Error
	return messages, err
}

// Update ...
func (r *ChatMessageRepository) Update(m *models.ChatMessage) error {
	return r.DB.Updates(&m).Error
}
