package service_test

import (
	"net/http"
	"testing"

	"github.com/RediSearch/redisearch-go/redisearch"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

func TestSaveDisplayNames(t *testing.T) {
	autocompleter := redisearch.NewAutocompleter("localhost:6379", "rxnorm")

	repository := repository.RxNormRepository{
		HttpClient:        http.Client{},
		Autocompleter: autocompleter,
		RxNormURL:         "https://rxnav.nlm.nih.gov/REST",
	}

	service := service.RxNormService{
		RxNormRepository: repository,
	}

	err := service.SaveDisplayNames()
	assert.NoError(t, err)
}
