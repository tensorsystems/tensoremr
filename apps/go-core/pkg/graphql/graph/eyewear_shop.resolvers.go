package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) CreateEyewearShop(ctx context.Context, input graph_models.EyewearShopInput) (*models.EyewearShop, error) {
	var entity models.EyewearShop
	deepCopy.Copy(&input).To(&entity)

	if err := r.EyewearShopRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateEyewearShop(ctx context.Context, input graph_models.EyewearShopUpdateInput) (*models.EyewearShop, error) {
	var entity models.EyewearShop
	deepCopy.Copy(&input).To(&entity)

	if err := r.EyewearShopRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteEyewearShop(ctx context.Context, id int) (bool, error) {
	if err := r.EyewearShopRepository.Delete(id); err != nil {
		return false, err
	}
	return true, nil
}

func (r *queryResolver) EyewearShop(ctx context.Context, id int) (*models.EyewearShop, error) {
	var entity models.EyewearShop

	if err := r.EyewearShopRepository.Get(&entity, id); err != nil {
		return nil, err
	}
	return &entity, nil
}

func (r *queryResolver) EyewearShops(ctx context.Context, page models.PaginationInput) (*graph_models.EyewearShopConnection, error) {
	result, count, err := r.EyewearShopRepository.GetAll(page, nil)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.EyewearShopEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.EyewearShopEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.EyewearShopConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
