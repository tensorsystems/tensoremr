package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/tensorsystems/tensoremr/apps/server/pkg/graphql/graph/generated"
	graph_models "github.com/tensorsystems/tensoremr/apps/server/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/service"
	deepCopy "github.com/ulule/deepcopier"
	"gorm.io/datatypes"
)

func (r *diagnosticProcedureResolver) Modalities(ctx context.Context, obj *models.DiagnosticProcedure) (*string, error) {
	mod := obj.Modalities.String()
	return &mod, nil
}

func (r *mutationResolver) OrderDiagnosticProcedure(ctx context.Context, input graph_models.OrderDiagnosticProcedureInput) (*models.DiagnosticProcedureOrder, error) {
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

	// Save diagnostic procedure
	var diagnosticProcedureOrder models.DiagnosticProcedureOrder
	var diagnosticProcedure models.DiagnosticProcedure
	if err := r.DiagnosticProcedureOrderRepository.Save(&diagnosticProcedureOrder, &diagnosticProcedure, input.DiagnosticProcedureTypeID, input.PatientChartID, input.PatientID, input.BillingID, user, input.OrderNote, input.ReceptionNote); err != nil {
		return nil, err
	}

	studyUid, err := service.GenerateStudyUid()
	if err != nil {
		return nil, err
	}

	if input.Modality != nil {
		modalities := datatypes.JSON([]byte("[\"" + *input.Modality + "\"]"))
		diagnosticProcedure.Modalities = modalities
	}

	diagnosticProcedure.DicomStudyUid = studyUid
	if err := r.DiagnosticProcedureRepository.Update(&diagnosticProcedure); err != nil {
		return nil, err
	}

	r.Redis.Publish(ctx, "diagnostic-procedures-update", diagnosticProcedure.ID)

	return &diagnosticProcedureOrder, nil
}

func (r *mutationResolver) OrderAndConfirmDiagnosticProcedure(ctx context.Context, input graph_models.OrderAndConfirmDiagnosticProcedureInput) (*models.DiagnosticProcedureOrder, error) {
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

	var diagnosticProcedureOrder models.DiagnosticProcedureOrder
	var diagnosticProcedure models.DiagnosticProcedure
	if err := r.DiagnosticProcedureOrderRepository.Save(&diagnosticProcedureOrder, &diagnosticProcedure, input.DiagnosticProcedureTypeID, patientChart.ID, appointment.PatientID, input.BillingID, user, input.OrderNote, ""); err != nil {
		return nil, err
	}

	if err := r.DiagnosticProcedureOrderRepository.Confirm(&diagnosticProcedureOrder, diagnosticProcedureOrder.ID, input.InvoiceNo); err != nil {
		return nil, err
	}

	r.Redis.Publish(ctx, "diagnostic-procedures-update", diagnosticProcedure.ID)

	return &diagnosticProcedureOrder, nil
}

func (r *mutationResolver) ConfirmDiagnosticProcedureOrder(ctx context.Context, id int, invoiceNo string) (*models.DiagnosticProcedureOrder, error) {
	var entity models.DiagnosticProcedureOrder
	if err := r.DiagnosticProcedureOrderRepository.Confirm(&entity, id, invoiceNo); err != nil {
		return nil, err
	}

	for _, diagnosticProcedure := range entity.DiagnosticProcedures {
		r.Redis.Publish(ctx, "diagnostic-procedures-update", diagnosticProcedure.ID)

		var modalities []string
		err := json.Unmarshal([]byte(diagnosticProcedure.Modalities.String()), &modalities)

		if err != nil || len(modalities) == 0 {
			continue
		}

		var patient models.Patient
		if err := r.PatientRepository.Get(&patient, entity.PatientID); err != nil {
			return nil, err
		}

		var physician models.User
		if err := r.UserRepository.Get(&physician, *entity.OrderedByID); err != nil {
			return nil, err
		}

		for _, modality := range modalities {
			service.CreateWorklist(*diagnosticProcedure.DicomStudyUid, modality, patient, physician, diagnosticProcedure)
		}
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateDiagnosticProcedureOrder(ctx context.Context, input graph_models.DiagnosticProcedureOrderUpdateInput) (*models.DiagnosticProcedureOrder, error) {
	var entity models.DiagnosticProcedureOrder
	deepCopy.Copy(&input).To(&entity)

	if input.Status != nil {
		entity.Status = models.DiagnosticProcedureOrderStatus(*input.Status)
	}

	if err := r.DiagnosticProcedureOrderRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) SaveDiagnosticProcedure(ctx context.Context, input graph_models.DiagnosticProcedureInput) (*models.DiagnosticProcedure, error) {
	var entity models.DiagnosticProcedure
	deepCopy.Copy(&input).To(&entity)

	if err := r.DiagnosticProcedureRepository.Save(&entity); err != nil {
		return nil, err
	}

	r.Redis.Publish(ctx, "diagnostic-procedures-update", entity.ID)

	return &entity, nil
}

func (r *mutationResolver) UpdateDiagnosticProcedure(ctx context.Context, input graph_models.DiagnosticProcedureUpdateInput) (*models.DiagnosticProcedure, error) {
	var entity models.DiagnosticProcedure
	deepCopy.Copy(&input).To(&entity)

	// Images ...
	for _, fileUpload := range input.Images {
		fileName, hashedFileName, hash, ext := HashFileName(fileUpload.Name)

		err := WriteFile(fileUpload.File.File, hashedFileName+"."+ext)
		if err != nil {
			return nil, err
		}

		entity.Images = append(entity.Images, models.File{
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

	if input.Status != nil {
		entity.Status = models.DiagnosticProcedureStatus(*input.Status)
	}

	if err := r.DiagnosticProcedureRepository.Update(&entity); err != nil {
		return nil, err
	}

	r.Redis.Publish(ctx, "diagnostic-procedures-update", entity.ID)

	return &entity, nil
}

func (r *mutationResolver) DeleteDiagnosticProcedure(ctx context.Context, id int) (bool, error) {
	if err := r.DiagnosticProcedureRepository.Delete(id); err != nil {
		return false, err
	}

	r.Redis.Publish(ctx, "diagnostic-procedures-delete", id)

	return true, nil
}

func (r *mutationResolver) SaveDiagnosticProcedureType(ctx context.Context, input graph_models.DiagnosticProcedureTypeInput) (*models.DiagnosticProcedureType, error) {
	var entity models.DiagnosticProcedureType
	deepCopy.Copy(&input).To(&entity)

	billings, err := r.BillingRepository.GetByIds(input.BillingIds)
	if err != nil {
		return nil, err
	}

	entity.Billings = billings

	if err := r.DiagnosticProcedureTypeRepository.Save(&entity); err != nil {
		return nil, err
	}
	return &entity, nil
}

func (r *mutationResolver) UpdateDiagnosticProcedureType(ctx context.Context, input graph_models.DiagnosticProcedureTypeUpdateInput) (*models.DiagnosticProcedureType, error) {
	var entity models.DiagnosticProcedureType
	deepCopy.Copy(&input).To(&entity)

	billings, err := r.BillingRepository.GetByIds(input.BillingIds)
	if err != nil {
		return nil, err
	}

	entity.Billings = billings

	if err := r.DiagnosticProcedureTypeRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteDiagnosticProcedureType(ctx context.Context, id int) (bool, error) {
	if err := r.DiagnosticProcedureTypeRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeleteDiagnosticImage(ctx context.Context, input graph_models.DiagnosticProcedureDeleteFileInput) (bool, error) {
	if err := r.DiagnosticProcedureRepository.DeleteFile("Images", input.DiagnosticProcedureID, input.FileID); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeleteDiagnosticRightEyeImage(ctx context.Context, input graph_models.DiagnosticProcedureDeleteFileInput) (bool, error) {
	if err := r.DiagnosticProcedureRepository.DeleteFile("RightEyeImages", input.DiagnosticProcedureID, input.FileID); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeleteDiagnosticLeftEyeImage(ctx context.Context, input graph_models.DiagnosticProcedureDeleteFileInput) (bool, error) {
	if err := r.DiagnosticProcedureRepository.DeleteFile("LeftEyeImages", input.DiagnosticProcedureID, input.FileID); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeleteDiagnosticRightEyeSketch(ctx context.Context, input graph_models.DiagnosticProcedureDeleteFileInput) (bool, error) {
	if err := r.DiagnosticProcedureRepository.DeleteFile("RightEyeSketches", input.DiagnosticProcedureID, input.FileID); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeleteDiagnosticLeftEyeSketch(ctx context.Context, input graph_models.DiagnosticProcedureDeleteFileInput) (bool, error) {
	if err := r.DiagnosticProcedureRepository.DeleteFile("LeftEyeSketches", input.DiagnosticProcedureID, input.FileID); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeleteDiagnosticDocument(ctx context.Context, input graph_models.DiagnosticProcedureDeleteFileInput) (bool, error) {
	if err := r.DiagnosticProcedureRepository.DeleteFile("Documents", input.DiagnosticProcedureID, input.FileID); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) DiagnosticProcedure(ctx context.Context, filter graph_models.DiagnosticProcedureFilter) (*models.DiagnosticProcedure, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) DiagnosticProcedures(ctx context.Context, page models.PaginationInput, filter *graph_models.DiagnosticProcedureFilter) (*graph_models.DiagnosticProcedureConnection, error) {
	var f models.DiagnosticProcedure
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	procedures, count, err := r.DiagnosticProcedureRepository.GetAll(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.DiagnosticProcedureEdge, len(procedures))

	for i, entity := range procedures {
		e := entity

		edges[i] = &graph_models.DiagnosticProcedureEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(procedures, count, page)
	return &graph_models.DiagnosticProcedureConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) DiagnosticProcedureOrder(ctx context.Context, patientChartID int) (*models.DiagnosticProcedureOrder, error) {
	var entity models.DiagnosticProcedureOrder

	if err := r.DiagnosticProcedureOrderRepository.GetByPatientChartID(&entity, patientChartID); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) SearchDiagnosticProcedureOrders(ctx context.Context, page models.PaginationInput, filter *graph_models.DiagnosticProcedureOrderFilter, date *time.Time, searchTerm *string) (*graph_models.DiagnosticProcedureOrderConnection, error) {
	var f models.DiagnosticProcedureOrder
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	if filter.Status != nil {
		f.Status = models.DiagnosticProcedureOrderStatus(*filter.Status)
	}

	result, count, err := r.DiagnosticProcedureOrderRepository.Search(page, &f, date, searchTerm, false)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.DiagnosticProcedureOrderEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.DiagnosticProcedureOrderEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.DiagnosticProcedureOrderConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) DiagnosticProcedureTypes(ctx context.Context, page models.PaginationInput, searchTerm *string) (*graph_models.DiagnosticProcedureTypeConnection, error) {
	result, count, err := r.DiagnosticProcedureTypeRepository.GetAll(page, searchTerm)
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.DiagnosticProcedureTypeEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.DiagnosticProcedureTypeEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.DiagnosticProcedureTypeConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) Refraction(ctx context.Context, patientChartID int) (*models.DiagnosticProcedure, error) {
	var entity models.DiagnosticProcedure

	if err := r.DiagnosticProcedureRepository.GetRefraction(&entity, patientChartID); err != nil {
		return nil, nil
	}

	return &entity, nil
}

// DiagnosticProcedure returns generated.DiagnosticProcedureResolver implementation.
func (r *Resolver) DiagnosticProcedure() generated.DiagnosticProcedureResolver {
	return &diagnosticProcedureResolver{r}
}

type diagnosticProcedureResolver struct{ *Resolver }
