package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"
	"time"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) OrderReferral(ctx context.Context, input graph_models.OrderReferralInput) (*models.ReferralOrder, error) {
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

	var referral models.ReferralOrder
	if err := r.ReferralOrderRepository.Save(&referral, input.PatientChartID, input.PatientID, input.ReferredToID, input.Type, user, input.ReceptionNote, input.Reason, input.ProviderName); err != nil {
		return nil, err
	}

	return &referral, nil
}

func (r *mutationResolver) ConfirmReferralOrder(ctx context.Context, input graph_models.ConfirmReferralOrderInput) (*graph_models.ConfirmReferralOrderResult, error) {
	var entity models.ReferralOrder

	if err := r.ReferralOrderRepository.ConfirmOrder(&entity, input.ReferralOrderID, input.ReferralID, input.BillingID, input.InvoiceNo, input.RoomID, input.CheckInTime); err != nil {
		return nil, err
	}

	return &graph_models.ConfirmReferralOrderResult{
		ReferralOrder: &entity,
		ReferralID:    input.ReferralID,
		InvoiceNo:     input.InvoiceNo,
		BillingID:     input.BillingID,
	}, nil
}

func (r *mutationResolver) DeleteReferral(ctx context.Context, id int) (bool, error) {
	if err := r.ReferralOrderRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) Referral(ctx context.Context, filter graph_models.ReferralFilter) (*models.Referral, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Referrals(ctx context.Context, page models.PaginationInput, filter *graph_models.ReferralFilter) (*graph_models.ReferralConnection, error) {
	var f models.Referral
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	entities, count, err := r.ReferralRepository.GetAll(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ReferralEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.ReferralEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.ReferralConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) ReferralOrder(ctx context.Context, patientChartID int) (*models.ReferralOrder, error) {
	var entity models.ReferralOrder

	if err := r.ReferralOrderRepository.GetByPatientChartID(&entity, patientChartID); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) SearchReferralOrders(ctx context.Context, page models.PaginationInput, filter *graph_models.ReferralOrderFilter, date *time.Time, searchTerm *string) (*graph_models.ReferralOrderConnection, error) {
	var f models.ReferralOrder
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	if filter.Status != nil {
		f.Status = models.ReferralOrderStatus(*filter.Status)
	}

	result, count, err := r.ReferralOrderRepository.Search(page, &f, date, searchTerm, false)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ReferralOrderEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.ReferralOrderEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.ReferralOrderConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
