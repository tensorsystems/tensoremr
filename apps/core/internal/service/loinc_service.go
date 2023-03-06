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

package service

import "github.com/RediSearch/redisearch-go/redisearch"

type LoincService struct {
	Client *redisearch.Client
}

// SearchForms ...
func (l *LoincService) SearchForms(term string) ([]redisearch.Document, int, error) {
	return l.Client.Search(redisearch.NewQuery("@PanelType:Panel @LONG_COMMON_NAME:"+term).
		Limit(0, 20))
}
