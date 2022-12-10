package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SavePaymentWaiver(ctx context.Context, input graph_models.PaymentWaiverInput) (*models.PaymentWaiver, error) {
	gc, err := middleware.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	email := gc.GetString("email")
	if len(email) == 0 {
		return nil, errors.New("Cannot find user")
	}

	var user models.User
	if err := r.UserRepository.GetByEmail(&user, email); err != nil {
		return nil, err
	}

	var entity models.PaymentWaiver
	deepCopy.Copy(&input).To(&entity)

	entity.UserID = user.ID

	approved := false
	entity.Approved = &approved

	if err := r.PaymentWaiverRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdatePaymentWaiver(ctx context.Context, input graph_models.PaymentWaiverUpdateInput) (*models.PaymentWaiver, error) {
	gc, err := middleware.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	email := gc.GetString("email")
	if len(email) == 0 {
		return nil, errors.New("Cannot find user")
	}

	var user models.User
	if err := r.UserRepository.GetByEmail(&user, email); err != nil {
		return nil, err
	}

	var entity models.PaymentWaiver
	deepCopy.Copy(&input).To(&entity)

	entity.UserID = user.ID

	if err := r.PaymentWaiverRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeletePaymentWaiver(ctx context.Context, id int) (bool, error) {
	if err := r.PaymentWaiverRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) ApprovePaymentWaiver(ctx context.Context, id int, approve bool) (*models.PaymentWaiver, error) {
	var entity models.PaymentWaiver

	if err := r.PaymentWaiverRepository.ApproveWaiver(&entity, id, approve); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) PaymentWaivers(ctx context.Context, page models.PaginationInput) (*graph_models.PaymentWaiverConnection, error) {
	result, count, err := r.PaymentWaiverRepository.GetAll(page)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.PaymentWaiverEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.PaymentWaiverEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.PaymentWaiverConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) PaymentWaiver(ctx context.Context, id int) (*models.PaymentWaiver, error) {
	var entity models.PaymentWaiver

	if err := r.PaymentWaiverRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	return &entity, nil
}
