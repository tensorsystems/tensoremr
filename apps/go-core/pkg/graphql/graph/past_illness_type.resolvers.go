package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SavePastIllnessTypes(ctx context.Context, input graph_models.PastIllnessTypeInput) (*models.PastIllnessType, error) {
	var entity models.PastIllnessType
	deepCopy.Copy(&input).To(&entity)

	if err := r.PastIllnessTypeRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdatePastIllnessType(ctx context.Context, input graph_models.PastIllnessTypeUpdateInput) (*models.PastIllnessType, error) {
	var entity models.PastIllnessType
	deepCopy.Copy(&input).To(&entity)

	if err := r.PastIllnessTypeRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeletePastIllnessType(ctx context.Context, id int) (bool, error) {
	if err := r.PastIllnessTypeRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) PastIllnessType(ctx context.Context, id int) (*models.PastIllnessType, error) {
	var entity models.PastIllnessType

	if err := r.PastIllnessTypeRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) PastIllnessTypes(ctx context.Context, page models.PaginationInput) (*graph_models.PastIllnessTypeConnection, error) {
	result, count, err := r.PastIllnessTypeRepository.GetAll(page)
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.PastIllnessTypeEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.PastIllnessTypeEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.PastIllnessTypeConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
