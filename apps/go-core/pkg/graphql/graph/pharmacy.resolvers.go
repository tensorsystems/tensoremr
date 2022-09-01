package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) CreatePharmacy(ctx context.Context, input graph_models.PharmacyInput) (*models.Pharmacy, error) {
	var entity models.Pharmacy
	deepCopy.Copy(&input).To(&entity)

	if err := r.PharmacyRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdatePharmacy(ctx context.Context, input graph_models.PharmacyUpdateInput) (*models.Pharmacy, error) {
	var entity models.Pharmacy
	deepCopy.Copy(&input).To(&entity)

	if err := r.PharmacyRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeletePharmacy(ctx context.Context, id int) (bool, error) {
	if err := r.PharmacyRepository.Delete(id); err != nil {
		return false, err
	}
	return true, nil
}

func (r *queryResolver) Pharmacy(ctx context.Context, id int) (*models.Pharmacy, error) {
	var entity models.Pharmacy

	if err := r.PharmacyRepository.Get(&entity, id); err != nil {
		return nil, err
	}
	return &entity, nil
}

func (r *queryResolver) Pharmacies(ctx context.Context, page models.PaginationInput) (*graph_models.PharmacyConnection, error) {
	result, count, err := r.PharmacyRepository.GetAll(page, nil)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.PharmacyEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.PharmacyEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.PharmacyConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
