package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SaveLifestyleTypes(ctx context.Context, input graph_models.LifestyleTypeInput) (*models.LifestyleType, error) {
	var entity models.LifestyleType
	deepCopy.Copy(&input).To(&entity)

	if err := r.LifestyleTypeRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateLifestyleType(ctx context.Context, input graph_models.LifestyleTypeUpdateInput) (*models.LifestyleType, error) {
	var entity models.LifestyleType
	deepCopy.Copy(&input).To(&entity)

	if err := r.LifestyleTypeRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteLifestyleType(ctx context.Context, id int) (bool, error) {
	if err := r.LifestyleTypeRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) LifestyleType(ctx context.Context, id int) (*models.LifestyleType, error) {
	var entity models.LifestyleType

	if err := r.LifestyleTypeRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) LifestyleTypes(ctx context.Context, page models.PaginationInput) (*graph_models.LifestyleTypeConnection, error) {
	result, count, err := r.LifestyleTypeRepository.GetAll(page)
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.LifestyleTypeEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.LifestyleTypeEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.LifestyleTypeConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
