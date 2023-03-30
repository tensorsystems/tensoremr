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
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
)

type QuestionnaireService struct {
	QuestionnaireRepository repository.QuestionnaireRepository
}

func NewQuestionnaireService(repository repository.QuestionnaireRepository) QuestionnaireService {
	return QuestionnaireService{
		QuestionnaireRepository: repository,
	}
}

// GetOneQuestionnaire ...
func (q *QuestionnaireService) GetOneQuestionnaire(ID string) (*fhir.Questionnaire, error) {
	questionnaire, err := q.QuestionnaireRepository.GetOneQuestionnaire(ID)
	if err != nil {
		return nil, err
	}

	return questionnaire, nil
}

// CreateQuestionnaire ...
func (q *QuestionnaireService) CreateQuestionnaire(qu fhir.Questionnaire) (*fhir.Questionnaire, error) {
	questionnaire, err := q.QuestionnaireRepository.CreateQuestionnaire(qu)
	if err != nil {
		return nil, err
	}

	return questionnaire, nil
}

// UpdateQuestionnaire ...
func (q *QuestionnaireService) UpdateQuestionnaire(qu fhir.Questionnaire) (*fhir.Questionnaire, error) {
	questionnaire, err := q.QuestionnaireRepository.UpdateQuestionnaire(qu)
	if err != nil {
		return nil, err
	}

	return questionnaire, nil
}
