package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"

	graph_models "github.com/tensorsystems/tensoremr/apps/server/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SavePaymentOrderWaiver(ctx context.Context, input graph_models.PaymentOrderWaiverInput) (*models.PaymentOrderWaiver, error) {
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

	var entity models.PaymentOrderWaiver
	deepCopy.Copy(&input).To(&entity)

	entity.UserID = user.ID

	if err := r.PaymentOrderWaiverRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdatePaymentOrderWaiver(ctx context.Context, input graph_models.PaymentOrderWaiverUpdateInput) (*models.PaymentOrderWaiver, error) {
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

	var entity models.PaymentOrderWaiver
	deepCopy.Copy(&input).To(&entity)

	entity.UserID = user.ID

	if err := r.PaymentOrderWaiverRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeletePaymentOrderWaiver(ctx context.Context, id int) (bool, error) {
	if err := r.PaymentOrderWaiverRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) ApprovePaymentOrderWaiver(ctx context.Context, id int, approve bool) (*models.PaymentOrderWaiver, error) {
	var entity models.PaymentOrderWaiver

	if err := r.PaymentOrderWaiverRepository.ApproveWaiver(&entity, id, approve); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) RequestPaymentOrderWaiver(ctx context.Context, orderID int, orderType *string, patientID int) (*models.PaymentOrderWaiver, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) PaymentOrderWaivers(ctx context.Context, page models.PaginationInput) (*graph_models.PaymentOrderWaiverConnection, error) {
	result, count, err := r.PaymentOrderWaiverRepository.GetAll(page)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.PaymentOrderWaiverEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.PaymentOrderWaiverEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.PaymentOrderWaiverConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) PaymentOrderWaiver(ctx context.Context, id int) (*models.PaymentOrderWaiver, error) {
	var entity models.PaymentOrderWaiver

	if err := r.PaymentOrderWaiverRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	return &entity, nil
}
