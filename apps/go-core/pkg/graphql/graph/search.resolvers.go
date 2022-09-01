package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
)

func (r *queryResolver) Search(ctx context.Context, searchTerm string) (*graph_models.SearchResult, error) {
	patients, err := r.PatientRepository.Search(searchTerm)
	if err != nil {
		return nil, err
	}

	providers, err := r.UserRepository.SearchPhysicians(searchTerm)
	if err != nil {
		return nil, err
	}

	searchResult := &graph_models.SearchResult{
		Patients:  patients,
		Providers: providers,
	}

	return searchResult, nil
}
