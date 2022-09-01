package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SaveAllergy(ctx context.Context, input graph_models.AllergyInput) (*models.Allergy, error) {
	var entity models.Allergy
	deepCopy.Copy(&input).To(&entity)

	if err := r.AllergyRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateAllergy(ctx context.Context, input graph_models.AllergyUpdateInput) (*models.Allergy, error) {
	var entity models.Allergy
	deepCopy.Copy(&input).To(&entity)

	if err := r.AllergyRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteAllergy(ctx context.Context, id int) (bool, error) {
	if err := r.AllergyRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) Allergies(ctx context.Context, page models.PaginationInput, filter *graph_models.AllergyFilter) (*graph_models.AllergyConnection, error) {
	var f models.Allergy
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	entities, count, err := r.AllergyRepository.GetAll(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.AllergyEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.AllergyEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.AllergyConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
