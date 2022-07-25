package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/server/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SaveSupply(ctx context.Context, input graph_models.SupplyInput) (*models.Supply, error) {
	var entity models.Supply
	deepCopy.Copy(&input).To(&entity)

	billings, err := r.BillingRepository.GetByIds(input.BillingIds)
	if err != nil {
		return nil, err
	}

	entity.Billings = billings

	if err := r.SupplyRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateSupply(ctx context.Context, input graph_models.SupplyUpdateInput) (*models.Supply, error) {
	var entity models.Supply
	deepCopy.Copy(&input).To(&entity)

	billings, err := r.BillingRepository.GetByIds(input.BillingIds)
	if err != nil {
		return nil, err
	}

	entity.Billings = billings

	if err := r.SupplyRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteSupply(ctx context.Context, id int) (bool, error) {
	if err := r.SupplyRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) Supplies(ctx context.Context, page models.PaginationInput, searchTerm *string) (*graph_models.SupplyConnection, error) {
	result, count, err := r.SupplyRepository.GetAll(page, searchTerm)
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.SupplyEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.SupplyEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.SupplyConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
