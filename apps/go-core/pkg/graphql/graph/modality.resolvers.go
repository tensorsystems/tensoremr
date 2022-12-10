package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) UpdateModality(ctx context.Context, input graph_models.ModalityUpdateInput) (*models.Modality, error) {
	var modality models.Modality
	deepCopy.Copy(&input).To(&modality)

	if err := r.ModalityRepository.Update(&modality); err != nil {
		return nil, err
	}

	return &modality, nil
}

func (r *queryResolver) Modalities(ctx context.Context, page models.PaginationInput, filter *graph_models.ModalityFilter) (*graph_models.ModalityConnection, error) {
	var f models.Modality
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	result, count, err := r.ModalityRepository.GetAll(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ModalityEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.ModalityEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)

	return &graph_models.ModalityConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
