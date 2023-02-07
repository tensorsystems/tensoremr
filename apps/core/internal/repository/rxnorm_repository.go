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
	"io"
	"net/http"

	"github.com/RediSearch/redisearch-go/redisearch"
)

type RxNormRepository struct {
	HttpClient    http.Client
	Autocompleter *redisearch.Autocompleter
	RxNormURL     string
}

func (r *RxNormRepository) GetDisplayNames() ([]byte, int, error) {
	url := r.RxNormURL + "/displaynames.json"
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, 500, err
	}

	req.Header.Add("Content-Type", "application/json")

	resp, err := r.HttpClient.Do(req)
	if err != nil {
		return nil, 500, err
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, 500, err
	}

	return body, resp.StatusCode, nil
}

func (r *RxNormRepository) SaveRxNormDisplayTerms(terms []string) error {
	suggestions := []redisearch.Suggestion{}
	for _, term := range terms {
		s := redisearch.Suggestion{
			Term:  term,
			Score: 1,
		}

		suggestions = append(suggestions, s)

	}

	err := r.Autocompleter.AddTerms(suggestions...)
	return err
}

func (r *RxNormRepository) Suggest(prefix string) ([]redisearch.Suggestion, error) {
	suggestions, err := r.Autocompleter.SuggestOpts(prefix, redisearch.SuggestOptions{
		Num:   20,
		Fuzzy: true,
	})

	if err != nil {
		return nil, err
	}

	return suggestions, nil
}
