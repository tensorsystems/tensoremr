package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"time"

	graph_models "github.com/tensorsystems/tensoremr/apps/server/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) OrderTreatment(ctx context.Context, input graph_models.OrderTreatmentInput) (*models.TreatmentOrder, error) {
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

	isPhysician := false
	for _, e := range user.UserTypes {
		if e.Title == "Physician" {
			isPhysician = true
		}
	}

	if !isPhysician {
		return nil, errors.New("You are not authorized to perform this action")
	}

	var treatmentOrder models.TreatmentOrder
	var treatment models.Treatment
	if err := r.TreatmentOrderRepository.SaveOpthalmologyTreatment(&treatmentOrder, &treatment, input.TreatmentTypeID, input.PatientChartID, input.PatientID, input.BillingID, user, input.TreatmentNote, input.OrderNote); err != nil {
		return nil, err
	}

	r.Redis.Publish(ctx, "treatments-update", treatment.ID)

	return &treatmentOrder, nil
}

func (r *mutationResolver) ConfirmTreatmentOrder(ctx context.Context, input graph_models.ConfirmTreatmentOrderInput) (*graph_models.ConfirmTreatmentOrderResult, error) {
	var entity models.TreatmentOrder
	var treatment models.Treatment
	var appointment models.Appointment
	if err := r.TreatmentOrderRepository.ConfirmOrder(&entity, &treatment, &appointment, input.TreatmentOrderID, input.TreatmentID, *input.InvoiceNo, input.RoomID, input.CheckInTime); err != nil {
		return nil, err
	}

	r.Redis.Publish(ctx, "treatments-update", treatment.ID)
	r.Redis.Publish(ctx, "appointments-update", appointment.ID)

	return &graph_models.ConfirmTreatmentOrderResult{
		TreatmentOrder: &entity,
		TreatmentID:    input.TreatmentID,
		InvoiceNo:      *input.InvoiceNo,
	}, nil
}

func (r *mutationResolver) SaveTreatment(ctx context.Context, input graph_models.TreatmentInput) (*models.Treatment, error) {
	var entity models.Treatment
	deepCopy.Copy(&input).To(&entity)

	var existing models.Treatment
	if err := r.TreatmentRepository.GetByPatientChart(&existing, input.PatientChartID); err != nil {
		if err := r.TreatmentRepository.Save(&entity); err != nil {
			return nil, err
		}
	} else {
		entity.ID = existing.ID
		if err := r.TreatmentRepository.Update(&entity); err != nil {
			return nil, err
		}
	}

	r.Redis.Publish(ctx, "treatments-update", entity.ID)

	return &entity, nil
}

func (r *mutationResolver) UpdateTreatment(ctx context.Context, input graph_models.TreatmentUpdateInput) (*models.Treatment, error) {
	var entity models.Treatment
	deepCopy.Copy(&input).To(&entity)

	if err := r.TreatmentRepository.Update(&entity); err != nil {
		return nil, err
	}

	r.Redis.Publish(ctx, "treatments-update", entity.ID)

	return &entity, nil
}

func (r *mutationResolver) DeleteTreatment(ctx context.Context, id int) (bool, error) {
	if err := r.TreatmentRepository.Delete(id); err != nil {
		return false, err
	}

	r.Redis.Publish(ctx, "treatments-delete", id)

	return true, nil
}

func (r *mutationResolver) SaveTreatmentType(ctx context.Context, input graph_models.TreatmentTypeInput) (*models.TreatmentType, error) {
	var entity models.TreatmentType
	deepCopy.Copy(&input).To(&entity)

	// Save billings
	billings, err := r.BillingRepository.GetByIds(input.BillingIds)
	if err != nil {
		return nil, err
	}

	entity.Billings = billings

	// Save supplies
	supplies, err := r.SupplyRepository.GetByIds(input.SupplyIds)
	if err != nil {
		return nil, err
	}

	entity.Supplies = supplies

	if err := r.TreatmentTypeRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateTreatmentType(ctx context.Context, input graph_models.TreatmentTypeUpdateInput) (*models.TreatmentType, error) {
	var entity models.TreatmentType
	deepCopy.Copy(&input).To(&entity)

	// Save billings
	billings, err := r.BillingRepository.GetByIds(input.BillingIds)
	if err != nil {
		return nil, err
	}

	entity.Billings = billings

	// Save supplies
	supplies, err := r.SupplyRepository.GetByIds(input.SupplyIds)
	if err != nil {
		return nil, err
	}

	entity.Supplies = supplies

	if err := r.TreatmentTypeRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteTreatmentType(ctx context.Context, id int) (bool, error) {
	if err := r.TreatmentTypeRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) Treatment(ctx context.Context, patientChartID int) (*models.Treatment, error) {
	var entity models.Treatment

	if err := r.TreatmentRepository.GetByPatientChart(&entity, patientChartID); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) Treatments(ctx context.Context, page models.PaginationInput, filter *graph_models.TreatmentFilter) (*graph_models.TreatmentConnection, error) {
	var f models.Treatment
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	entities, count, err := r.TreatmentRepository.GetAll(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.TreatmentEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.TreatmentEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.TreatmentConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) GetTreatmentsByPatient(ctx context.Context, page models.PaginationInput, patientID int) (*graph_models.TreatmentConnection, error) {
	entities, count, err := r.TreatmentRepository.GetByPatient(page, patientID)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.TreatmentEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.TreatmentEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.TreatmentConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) TreatmentTypes(ctx context.Context, page models.PaginationInput, searchTerm *string) (*graph_models.TreatmentTypeConnection, error) {
	entities, count, err := r.TreatmentTypeRepository.GetAll(page, searchTerm)
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.TreatmentTypeEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.TreatmentTypeEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.TreatmentTypeConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) TreatmentOrder(ctx context.Context, patientChartID int) (*models.TreatmentOrder, error) {
	var entity models.TreatmentOrder

	if err := r.TreatmentOrderRepository.GetByPatientChartID(&entity, patientChartID); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) SearchTreatmentOrders(ctx context.Context, page models.PaginationInput, filter *graph_models.TreatmentOrderFilter, date *time.Time, searchTerm *string) (*graph_models.TreatmentOrderConnection, error) {
	var f models.TreatmentOrder
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	if filter.Status != nil {
		f.Status = models.TreatmentOrderStatus(*filter.Status)
	}

	result, count, err := r.TreatmentOrderRepository.Search(page, &f, date, searchTerm, false)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.TreatmentOrderEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.TreatmentOrderEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.TreatmentOrderConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
