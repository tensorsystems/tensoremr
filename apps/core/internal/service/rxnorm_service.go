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

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/RediSearch/redisearch-go/redisearch"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
)

type RxNormService struct {
	RxNormRepository repository.RxNormRepository
}

func NewRxNormService(repository repository.RxNormRepository) RxNormService {
	return RxNormService{
		RxNormRepository: repository,
	}
}

func (r *RxNormService) SaveDisplayNames() error {
	body, status, err := r.RxNormRepository.GetDisplayNames()
	if err != nil {
		return err
	}

	if status != 200 {
		return errors.New("something went wring")
	}

	result := make(map[string]interface{})
	if err := json.Unmarshal(body, &result); err != nil {
		return err
	}

	values := result["displayTermsList"].(map[string]interface{})["term"].([]interface{})
	terms := []string{}

	for _, value := range values {
		terms = append(terms, fmt.Sprint(value))
	}

	if err := r.RxNormRepository.SaveRxNormDisplayTerms(terms); err != nil {
		return err
	}

	return nil
}

func (r *RxNormService) Suggest(prefix string) ([]redisearch.Suggestion, error) {
	return r.RxNormRepository.Suggest(prefix)
}

func (r *RxNormService) GetApproximateTerms(term string) (map[string]interface{}, error) {
	if len(term) == 0 {
		return nil, errors.New("term cannot be empty")
	}

	return r.RxNormRepository.GetApproximateTerms(term)
}


func (r *RxNormService) GetAllRelatedInfo(rxcui string) (map[string]interface{}, error) {
	return r.RxNormRepository.GetAllRelatedInfo(rxcui)
}
