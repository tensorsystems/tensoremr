package repository_test

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/RediSearch/redisearch-go/redisearch"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
)

func TestGetDisplayNames(t *testing.T) {
	client := http.Client{}
	baseUrl := "https://rxnav.nlm.nih.gov/REST"

	repository := repository.RxNormRepository{
		HttpClient: client,
		RxNormURL:  baseUrl,
	}

	body, status, err := repository.GetDisplayNames()
	assert.NoError(t, err)
	assert.Equal(t, 200, status)

	result := make(map[string]interface{})
	err = json.Unmarshal(body, &result)
	assert.NoError(t, err)

	t.Log(result)
}

func TestSaveRxNormDisplayTerms(t *testing.T) {
	autocompleter := redisearch.NewAutocompleter("localhost:6379", "rxnorm")

	repository := repository.RxNormRepository{
		HttpClient:    http.Client{},
		Autocompleter: autocompleter,
		RxNormURL:     "https://rxnav.nlm.nih.gov/REST",
	}

	terms := []string{"Hello World"}
	err := repository.SaveRxNormDisplayTerms(terms)
	assert.NoError(t, err)
}

func TestSuggest(t *testing.T) {
	autocompleter := redisearch.NewAutocompleter("localhost:6379", "rxnorm")

	repository := repository.RxNormRepository{
		HttpClient:    http.Client{},
		Autocompleter: autocompleter,
		RxNormURL:     "https://rxnav.nlm.nih.gov/REST",
	}

	suggestions, err := repository.Suggest("Hello")
	assert.NoError(t, err)

	t.Log(suggestions)
}
