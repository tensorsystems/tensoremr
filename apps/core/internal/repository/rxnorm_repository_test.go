package repository_test

import (
	"net/http"
	"testing"

	"github.com/RediSearch/redisearch-go/redisearch"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
)

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
