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

func (r *mutationResolver) SaveLab(ctx context.Context, input graph_models.LabInput) (*models.Lab, error) {
	var entity models.Lab
	deepCopy.Copy(&input).To(&entity)

	if err := r.LabRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateLab(ctx context.Context, input graph_models.LabUpdateInput) (*models.Lab, error) {
	var entity models.Lab
	deepCopy.Copy(&input).To(&entity)

	if input.Status != nil {
		entity.Status = models.LabStatus(*input.Status)
	}
	// Images ...
	for _, fileUpload := range input.Images {
		fileName, hashedFileName, hash, ext := HashFileName(fileUpload.Name)
		err := WriteFile(fileUpload.File.File, hashedFileName+"."+ext)
		if err != nil {
			return nil, err
		}

		entity.Images = append(entity.RightEyeImages, models.File{
			ContentType: fileUpload.File.ContentType,
			Size:        fileUpload.File.Size,
			FileName:    fileName,
			Extension:   ext,
			Hash:        hash,
		})
	}

	// Documents
	for _, fileUpload := range input.Documents {
		fileName, hashedFileName, hash, ext := HashFileName(fileUpload.Name)
		err := WriteFile(fileUpload.File.File, hashedFileName+"."+ext)
		if err != nil {
			return nil, err
		}

		entity.Documents = append(entity.Documents, models.File{
			ContentType: fileUpload.File.ContentType,
			Size:        fileUpload.File.Size,
			FileName:    fileName,
			Extension:   ext,
			Hash:        hash,
		})
	}

	if err := r.LabRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteLab(ctx context.Context, id int) (bool, error) {
	if err := r.LabRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) SaveLabType(ctx context.Context, input graph_models.LabTypeInput) (*models.LabType, error) {
	var entity models.LabType
	deepCopy.Copy(&input).To(&entity)

	billings, err := r.BillingRepository.GetByIds(input.BillingIds)
	if err != nil {
		return nil, err
	}

	entity.Billings = billings

	if err := r.LabTypeRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateLabType(ctx context.Context, input graph_models.LabTypeUpdateInput) (*models.LabType, error) {
	var entity models.LabType
	deepCopy.Copy(&input).To(&entity)

	billings, err := r.BillingRepository.GetByIds(input.BillingIds)
	if err != nil {
		return nil, err
	}

	entity.Billings = billings

	if err := r.LabTypeRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteLabType(ctx context.Context, id int) (bool, error) {
	if err := r.LabTypeRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeleteLabRightEyeImage(ctx context.Context, input graph_models.LabDeleteFileInput) (bool, error) {
	if err := r.LabRepository.DeleteFile("RightEyeImages", input.LabID, input.FileID); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeleteLabLeftEyeImage(ctx context.Context, input graph_models.LabDeleteFileInput) (bool, error) {
	if err := r.LabRepository.DeleteFile("LeftEyeImages", input.LabID, input.FileID); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeleteLabRightEyeSketch(ctx context.Context, input graph_models.LabDeleteFileInput) (bool, error) {
	if err := r.LabRepository.DeleteFile("RightEyeSketches", input.LabID, input.FileID); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeleteLabLeftEyeSketch(ctx context.Context, input graph_models.LabDeleteFileInput) (bool, error) {
	if err := r.LabRepository.DeleteFile("LeftEyeSketches", input.LabID, input.FileID); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeleteLabImage(ctx context.Context, input graph_models.LabDeleteFileInput) (bool, error) {
	if err := r.LabRepository.DeleteFile("Images", input.LabID, input.FileID); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeleteLabDocument(ctx context.Context, input graph_models.LabDeleteFileInput) (bool, error) {
	if err := r.LabRepository.DeleteFile("Documents", input.LabID, input.FileID); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) OrderLab(ctx context.Context, input graph_models.OrderLabInput) (*models.LabOrder, error) {
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

	// Save lab order
	var labOrder models.LabOrder
	if err := r.LabOrderRepository.Save(&labOrder, input.LabTypeID, input.PatientChartID, input.PatientID, input.BillingIds, user, input.OrderNote, input.ReceptionNote); err != nil {
		return nil, err
	}

	return &labOrder, nil
}

func (r *mutationResolver) ConfirmLabOrder(ctx context.Context, id int, invoiceNo string) (*models.LabOrder, error) {
	var entity models.LabOrder

	if err := r.LabOrderRepository.Confirm(&entity, id, invoiceNo); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateLabOrder(ctx context.Context, input graph_models.LabOrderUpdateInput) (*models.LabOrder, error) {
	var entity models.LabOrder
	deepCopy.Copy(&input).To(&entity)

	if input.Status != nil {
		entity.Status = models.LabOrderStatus(*input.Status)
	}

	if err := r.LabOrderRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) OrderAndConfirmLab(ctx context.Context, input graph_models.OrderAndConfirmLabInput) (*models.LabOrder, error) {
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
	if err := r.AppointmentRepository.Get(&appointment, input.AppointmentID); err != nil {
		return nil, err
	}

	var patientChart models.PatientChart
	if err := r.PatientChartRepository.GetByAppointmentID(&patientChart, appointment.ID); err != nil {
		return nil, err
	}

	var labOrder models.LabOrder
	if err := r.LabOrderRepository.Save(&labOrder, input.LabTypeID, patientChart.ID, input.PatientID, input.BillingIds, user, input.OrderNote, ""); err != nil {
		return nil, err
	}

	if err := r.LabOrderRepository.Confirm(&labOrder, labOrder.ID, input.InvoiceNo); err != nil {
		return nil, err
	}

	return &labOrder, nil
}

func (r *queryResolver) Labs(ctx context.Context, page models.PaginationInput, filter *graph_models.LabFilter) (*graph_models.LabConnection, error) {
	var f models.Lab
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	entities, count, err := r.LabRepository.GetAll(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.LabEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.LabEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.LabConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) LabTypes(ctx context.Context, page models.PaginationInput, searchTerm *string) (*graph_models.LabTypeConnection, error) {
	result, count, err := r.LabTypeRepository.GetAll(page, searchTerm)
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.LabTypeEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.LabTypeEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.LabTypeConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) LabOrder(ctx context.Context, patientChartID int) (*models.LabOrder, error) {
	var entity models.LabOrder

	if err := r.LabOrderRepository.GetByPatientChartID(&entity, patientChartID); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) SearchLabOrders(ctx context.Context, page models.PaginationInput, filter *graph_models.LabOrderFilter, date *time.Time, searchTerm *string) (*graph_models.LabOrderConnection, error) {
	var f models.LabOrder
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	if filter.Status != nil {
		f.Status = models.LabOrderStatus(*filter.Status)
	}

	result, count, err := r.LabOrderRepository.Search(page, &f, date, searchTerm, false)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.LabOrderEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.LabOrderEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.LabOrderConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
