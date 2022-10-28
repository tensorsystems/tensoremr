package seeds

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/models"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/repository"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/services"
)

type Seeder struct {
	CodingRepository *repository.CodingRepository
	HttpClient       *http.Client
}

func NewSeeder(codingRepository *repository.CodingRepository, httpClient *http.Client) *Seeder {
	return &Seeder{CodingRepository: codingRepository, HttpClient: httpClient}
}

func (s *Seeder) SeedCodeSystem(codeSystem, url string) error {
	count, err := s.CodingRepository.CountBySystem(codeSystem)

	if err != nil {
		return err
	}

	if err != nil {
		return err
	}

	var rows []*models.Coding

	if count == 0 {
		service := services.CodeSystemService{Client: s.HttpClient}
		result, err := service.GetCodes(url)

		if err != nil {
			return err
		}

		var codeSystemResponse models.CodeSystemResponse

		if err := json.Unmarshal(result, &codeSystemResponse); err != nil {
			return err
		}

		for _, item := range codeSystemResponse.Concept {
			coding := models.Coding{
				ID:         uuid.New().String(),
				System:     codeSystemResponse.Url,
				Version:    codeSystemResponse.Version,
				Code:       item.Code,
				Display:    item.Display,
				Definition: item.Definition,
			}
			rows = append(rows, &coding)
		}
	}

	if len(rows) > 0 {
		_, err := s.CodingRepository.InsertBulk(rows)
		if err != nil {
			return err
		}
	}

	return nil
}

func (s *Seeder) SeedValueSet(system, url string) error {
	count, err := s.CodingRepository.CountBySystem(system)

	if err != nil {
		return err
	}

	if err != nil {
		return err
	}

	var rows []*models.Coding

	if count == 0 {
		service := services.CodeSystemService{Client: s.HttpClient}
		result, err := service.GetCodes(url)

		if err != nil {
			return err
		}

		var valueSetResponse models.ValueSetResponse

		if err := json.Unmarshal(result, &valueSetResponse); err != nil {
			return err
		}

		if len(valueSetResponse.Compose.Include) > 0 {
			for _, item := range valueSetResponse.Compose.Include[0].Concept {
				coding := models.Coding{
					ID:         uuid.New().String(),
					System:     valueSetResponse.Url,
					Version:    valueSetResponse.Version,
					Code:       item.Code,
					Display:    item.Display,
					Definition: item.Definition,
				}
				rows = append(rows, &coding)
			}
		}
	}

	if len(rows) > 0 {
		_, err := s.CodingRepository.InsertBulk(rows)
		if err != nil {
			return err
		}
	}

	return nil
}
