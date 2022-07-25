package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"
	"time"

	graph_models "github.com/tensorsystems/tensoremr/apps/server/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) OrderFollowUp(ctx context.Context, input graph_models.OrderFollowUpInput) (*models.FollowUpOrder, error) {
	// Get current user
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

	var entity models.FollowUpOrder
	if err := r.FollowUpOrderRepository.Save(&entity, input.PatientChartID, input.PatientID, user, input.ReceptionNote); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) ConfirmFollowUpOrder(ctx context.Context, input graph_models.ConfirmFollowUpOrderInput) (*graph_models.ConfirmFollowUpOrderResult, error) {
	var entity models.FollowUpOrder

	if err := r.FollowUpOrderRepository.ConfirmOrder(&entity, input.FollowUpOrderID, input.FollowUpID, input.BillingID, input.InvoiceNo, input.RoomID, input.CheckInTime); err != nil {
		return nil, err
	}

	return &graph_models.ConfirmFollowUpOrderResult{
		FollowUpOrder: &entity,
		FollowUpID:    input.FollowUpID,
		InvoiceNo:     input.InvoiceNo,
		BillingID:     input.BillingID,
	}, nil
}

func (r *mutationResolver) DeleteFollowUp(ctx context.Context, id int) (bool, error) {
	if err := r.FollowUpRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) SaveFollowUp(ctx context.Context, input graph_models.FollowUpInput) (*models.FollowUp, error) {
	var entity models.FollowUp
	deepCopy.Copy(&input).To(&entity)

	if err := r.FollowUpRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateFollowUp(ctx context.Context, input graph_models.FollowUpUpdateInput) (*models.FollowUp, error) {
	var entity models.FollowUp
	deepCopy.Copy(&input).To(&entity)

	if err := r.FollowUpRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) FollowUp(ctx context.Context, filter graph_models.FollowUpFilter) (*models.FollowUp, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) FollowUps(ctx context.Context, page models.PaginationInput, filter *graph_models.FollowUpFilter) (*graph_models.FollowUpConnection, error) {
	var f models.FollowUp
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	entities, count, err := r.FollowUpRepository.GetAll(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.FollowUpEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.FollowUpEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.FollowUpConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) FollowUpOrder(ctx context.Context, patientChartID int) (*models.FollowUpOrder, error) {
	var entity models.FollowUpOrder

	if err := r.FollowUpOrderRepository.GetByPatientChartID(&entity, patientChartID); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) SearchFollowUpOrders(ctx context.Context, page models.PaginationInput, filter *graph_models.FollowUpOrderFilter, date *time.Time, searchTerm *string) (*graph_models.FollowUpOrderConnection, error) {
	var f models.FollowUpOrder
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	if filter.Status != nil {
		f.Status = models.FollowUpOrderStatus(*filter.Status)
	}

	result, count, err := r.FollowUpOrderRepository.Search(page, &f, date, searchTerm, false)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.FollowUpOrderEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.FollowUpOrderEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.FollowUpOrderConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
