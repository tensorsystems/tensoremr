package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"time"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) OrderSurgicalProcedure(ctx context.Context, input graph_models.OrderSurgicalInput) (*models.SurgicalOrder, error) {
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

	var surgicalOrder models.SurgicalOrder
	var surgicalProcedure models.SurgicalProcedure
	if err := r.SurgicalOrderRepository.SaveOpthalmologyOrder(&surgicalOrder, &surgicalProcedure, input.SurgicalProcedureTypeID, input.PatientChartID, input.PatientID, input.BillingID, user, input.PerformOnEye, input.OrderNote, input.ReceptionNote); err != nil {
		return nil, err
	}

	r.Redis.Publish(ctx, "surgical-procedures-update", surgicalProcedure.ID)

	return &surgicalOrder, nil
}

func (r *mutationResolver) ConfirmSurgicalOrder(ctx context.Context, input graph_models.ConfirmSurgicalOrderInput) (*graph_models.ConfirmSurgicalOrderResult, error) {
	var entity models.SurgicalOrder
	var surgicalProcedure models.SurgicalProcedure
	var appointment models.Appointment
	if err := r.SurgicalOrderRepository.ConfirmOrder(&entity, &surgicalProcedure, &appointment, input.SurgicalOrderID, input.SurgicalProcedureID, *input.InvoiceNo, input.RoomID, input.CheckInTime); err != nil {
		return nil, err
	}

	r.Redis.Publish(ctx, "surgical-procedures-update", surgicalProcedure.ID)
	r.Redis.Publish(ctx, "appointments-update", appointment.ID)

	return &graph_models.ConfirmSurgicalOrderResult{
		SurgicalOrder:       &entity,
		SurgicalProcedureID: input.SurgicalProcedureID,
		InvoiceNo:           *input.InvoiceNo,
	}, nil
}

func (r *mutationResolver) SaveSurgicalProcedure(ctx context.Context, input graph_models.SurgicalProcedureInput) (*models.SurgicalProcedure, error) {
	var entity models.SurgicalProcedure
	deepCopy.Copy(&input).To(&entity)

	// Preanesthetic documents
	for _, fileUpload := range input.PreanestheticDocuments {
		fileName, hashedFileName, hash, ext := HashFileName(fileUpload.Name)

		err := WriteFile(fileUpload.File.File, hashedFileName+"."+ext)
		if err != nil {
			return nil, err
		}

		entity.PreanestheticDocuments = append(entity.PreanestheticDocuments, models.File{
			ContentType: fileUpload.File.ContentType,
			Size:        fileUpload.File.Size,
			FileName:    fileName,
			Extension:   ext,
			Hash:        hash,
		})
	}

	var existing models.SurgicalProcedure

	if err := r.SurgicalProcedureRepository.GetByPatientChart(&existing, input.PatientChartID); err != nil {
		if err := r.SurgicalProcedureRepository.Save(&entity); err != nil {
			return nil, err
		}
	} else {
		entity.ID = existing.ID
		if err := r.SurgicalProcedureRepository.Update(&entity); err != nil {
			return nil, err
		}
	}

	r.Redis.Publish(ctx, "surgical-procedures-update", entity.ID)

	return &entity, nil
}

func (r *mutationResolver) UpdateSurgicalProcedure(ctx context.Context, input graph_models.SurgicalProcedureUpdateInput) (*models.SurgicalProcedure, error) {
	var entity models.SurgicalProcedure
	deepCopy.Copy(&input).To(&entity)

	// Preanesthetic documents
	for _, fileUpload := range input.PreanestheticDocuments {
		fileName, hashedFileName, hash, ext := HashFileName(fileUpload.Name)

		err := WriteFile(fileUpload.File.File, hashedFileName+"."+ext)
		if err != nil {
			return nil, err
		}

		entity.PreanestheticDocuments = append(entity.PreanestheticDocuments, models.File{
			ContentType: fileUpload.File.ContentType,
			Size:        fileUpload.File.Size,
			FileName:    fileName,
			Extension:   ext,
			Hash:        hash,
		})
	}

	if err := r.SurgicalProcedureRepository.Update(&entity); err != nil {
		return nil, err
	}

	r.Redis.Publish(ctx, "surgical-procedures-update", entity.ID)

	return &entity, nil
}

func (r *mutationResolver) DeleteSurgicalProcedure(ctx context.Context, id int) (bool, error) {
	if err := r.SurgicalProcedureRepository.Delete(id); err != nil {
		return false, err
	}

	r.Redis.Publish(ctx, "surgical-procedures-delete", id)

	return true, nil
}

func (r *mutationResolver) SaveSurgicalProcedureType(ctx context.Context, input graph_models.SurgicalProcedureTypeInput) (*models.SurgicalProcedureType, error) {
	var entity models.SurgicalProcedureType
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

	if err := r.SurgicalProcedureTypeRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateSurgicalProcedureType(ctx context.Context, input graph_models.SurgicalProcedureTypeUpdateInput) (*models.SurgicalProcedureType, error) {
	var entity models.SurgicalProcedureType
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

	if err := r.SurgicalProcedureTypeRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteSurgicalProcedureType(ctx context.Context, id int) (bool, error) {
	if err := r.SurgicalProcedureTypeRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeletePreanestheticDocument(ctx context.Context, surgicalProcedureID int, fileID int) (bool, error) {
	if err := r.SurgicalProcedureRepository.DeleteFile("PreanestheticDocuments", surgicalProcedureID, fileID); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) UpdateSurgeryFitness(ctx context.Context, id int, fit bool) (*models.SurgicalProcedure, error) {
	var entity models.SurgicalProcedure

	if err := r.SurgicalProcedureRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	entity.FitForSurgery = &fit

	if err := r.SurgicalProcedureRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) OrderAndConfirmSurgery(ctx context.Context, input graph_models.OrderAndConfirmSurgicalProcedureInput) (*models.SurgicalOrder, error) {
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

	var appointment models.Appointment
	appointment.PatientID = input.PatientID
	appointment.CheckInTime = input.CheckInTime
	appointment.RoomID = input.RoomID
	appointment.VisitTypeID = input.VisitTypeID

	var status models.AppointmentStatus
	if err := r.AppointmentStatusRepository.GetByTitle(&status, "Surgery"); err != nil {
		return nil, err
	}

	appointment.AppointmentStatusID = status.ID

	if err := r.AppointmentRepository.CreateNewAppointment(&appointment, &input.BillingID, &input.InvoiceNo); err != nil {
		return nil, err
	}

	var patientChart models.PatientChart
	if err := r.PatientChartRepository.GetByAppointmentID(&patientChart, appointment.ID); err != nil {
		return nil, err
	}

	var surgicalOrder models.SurgicalOrder
	var surgicalProcedure models.SurgicalProcedure
	if err := r.SurgicalOrderRepository.SaveOpthalmologyOrder(&surgicalOrder, &surgicalProcedure, input.SurgicalProcedureTypeID, patientChart.ID, appointment.PatientID, input.BillingID, user, input.PerformOnEye, input.OrderNote, ""); err != nil {
		return nil, err
	}

	r.Redis.Publish(ctx, "surgical-procedures-update", surgicalProcedure.ID)

	// Confirm order

	// if err := surgicalOrder.ConfirmOrder(surgicalOrder.ID); err != nil {
	// 	return nil, err
	// }

	return &surgicalOrder, nil
}

func (r *queryResolver) SurgicalProcedure(ctx context.Context, patientChartID int) (*models.SurgicalProcedure, error) {
	var entity models.SurgicalProcedure

	if err := r.SurgicalProcedureRepository.GetByPatientChart(&entity, patientChartID); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) SurgicalProcedures(ctx context.Context, page models.PaginationInput, filter *graph_models.SurgicalProcedureFilter) (*graph_models.SurgicalProcedureConnection, error) {
	var f models.SurgicalProcedure
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	procedures, count, err := r.SurgicalProcedureRepository.GetAll(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.SurgicalProcedureEdge, len(procedures))

	for i, entity := range procedures {
		e := entity

		edges[i] = &graph_models.SurgicalProcedureEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(procedures, count, page)
	return &graph_models.SurgicalProcedureConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) GetSurgicalProceduresByPatient(ctx context.Context, page models.PaginationInput, patientID int) (*graph_models.SurgicalProcedureConnection, error) {
	procedures, count, err := r.SurgicalProcedureRepository.GetByPatient(page, patientID)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.SurgicalProcedureEdge, len(procedures))

	for i, entity := range procedures {
		e := entity

		edges[i] = &graph_models.SurgicalProcedureEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(procedures, count, page)
	return &graph_models.SurgicalProcedureConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) SurgicalProcedureTypes(ctx context.Context, page models.PaginationInput, searchTerm *string) (*graph_models.SurgicalProcedureTypeConnection, error) {
	result, count, err := r.SurgicalProcedureTypeRepository.GetAll(page, searchTerm)
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.SurgicalProcedureTypeEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.SurgicalProcedureTypeEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.SurgicalProcedureTypeConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) SurgicalOrder(ctx context.Context, patientChartID int) (*models.SurgicalOrder, error) {
	var entity models.SurgicalOrder

	if err := r.SurgicalOrderRepository.GetByPatientChartID(&entity, patientChartID); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) SearchSurgicalOrders(ctx context.Context, page models.PaginationInput, filter *graph_models.SurgicalOrderFilter, date *time.Time, searchTerm *string) (*graph_models.SurgicalOrderConnection, error) {
	var f models.SurgicalOrder
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	if filter.Status != nil {
		f.Status = models.SurgicalOrderStatus(*filter.Status)
	}

	result, count, err := r.SurgicalOrderRepository.Search(page, &f, date, searchTerm, false)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.SurgicalOrderEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.SurgicalOrderEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.SurgicalOrderConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
