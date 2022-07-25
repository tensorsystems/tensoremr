package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/server/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) CreateAmendment(ctx context.Context, input graph_models.AmendmentInput) (*models.Amendment, error) {
	var entity models.Amendment
	deepCopy.Copy(&input).To(&entity)

	if err := r.AmendmentRepository.Create(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateAmendment(ctx context.Context, input graph_models.AmendmentUpdateInput) (*models.Amendment, error) {
	var entity models.Amendment
	deepCopy.Copy(&input).To(&entity)

	if err := r.AmendmentRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteAmendment(ctx context.Context, id int) (bool, error) {
	if err := r.AmendmentRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) Amendment(ctx context.Context, id int) (*models.Amendment, error) {
	var entity models.Amendment
	if err := r.AmendmentRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) Amendments(ctx context.Context, filter *graph_models.AmendmentFilter) ([]*models.Amendment, error) {
	var f models.Amendment
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}
	result, err := r.AmendmentRepository.GetAll(&f)

	if err != nil {
		return nil, err
	}

	return result, nil
}
