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

func (r *mutationResolver) SaveMedicationPrescription(ctx context.Context, input graph_models.MedicalPrescriptionOrderInput) (*models.MedicalPrescriptionOrder, error) {
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

	t := time.Now()

	medicalPrescriptionOrder := models.MedicalPrescriptionOrder{
		PharmacyID:     input.PharmacyID,
		PatientChartID: input.PatientChartID,
		OrderedByID:    &user.ID,
	}

	medicalPrescription := models.MedicalPrescription{
		PatientID:           input.PatientID,
		Medication:          input.Medication,
		RxCui:               input.RxCui,
		Synonym:             input.Synonym,
		Tty:                 input.Tty,
		Language:            input.Language,
		Sig:                 input.Sig,
		Refill:              input.Refill,
		Generic:             input.Generic,
		SubstitutionAllowed: input.SubstitutionAllowed,
		DirectionToPatient:  input.DirectionToPatient,
		PrescribedDate:      &t,
		History:             input.History,
		Status:              *input.Status,
	}

	if err := r.MedicalPrescriptionOrderRepository.SaveMedicalPrescription(&medicalPrescriptionOrder, medicalPrescription, input.PatientID); err != nil {
		return nil, err
	}

	return &medicalPrescriptionOrder, nil
}

func (r *mutationResolver) SavePastMedication(ctx context.Context, input graph_models.MedicalPrescriptionInput) (*models.MedicalPrescription, error) {
	t := time.Now()

	medicalPrescription := models.MedicalPrescription{
		PatientID:           input.PatientID,
		Medication:          input.Medication,
		RxCui:               input.RxCui,
		Synonym:             input.Synonym,
		Tty:                 input.Tty,
		Language:            input.Language,
		Sig:                 input.Sig,
		Refill:              input.Refill,
		Generic:             input.Generic,
		SubstitutionAllowed: input.SubstitutionAllowed,
		DirectionToPatient:  input.DirectionToPatient,
		PrescribedDate:      &t,
		History:             input.History,
		Status:              *input.Status,
	}

	if err := r.MedicalPrescriptionRepository.Save(&medicalPrescription); err != nil {
		return nil, err
	}

	return &medicalPrescription, nil
}

func (r *mutationResolver) SaveEyewearPrescription(ctx context.Context, input graph_models.EyewearPrescriptionInput) (*models.EyewearPrescriptionOrder, error) {
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
	isOptometrist := false

	for _, e := range user.UserTypes {
		if e.Title == "Physician" {
			isPhysician = true
		}

		if e.Title == "Optometrist" {
			isOptometrist = true
		}
	}

	if !isPhysician && !isOptometrist {
		return nil, errors.New("You are not authorized to perform this action")
	}

	t := time.Now()

	eyewearPrescriptionOrder := models.EyewearPrescriptionOrder{
		EyewearShopID:  input.EyewearShopID,
		PatientChartID: input.PatientChartID,
		OrderedByID:    &user.ID,
	}

	eyewearPrescription := models.EyewearPrescription{
		PatientID:          input.PatientID,
		Glass:              input.Glass,
		Plastic:            input.Plastic,
		SingleVision:       input.SingleVision,
		PhotoChromatic:     input.PhotoChromatic,
		GlareFree:          input.GlareFree,
		ScratchResistant:   input.ScratchResistant,
		Bifocal:            input.Bifocal,
		Progressive:        input.Progressive,
		TwoSeparateGlasses: input.TwoSeparateGlasses,
		PrescribedDate:     &t,
		History:            input.History,
		Status:             *input.Status,
	}

	if err := r.EyewearPrescriptionOrderRepository.SaveEyewearPrescription(&eyewearPrescriptionOrder, eyewearPrescription, input.PatientID); err != nil {
		return nil, err
	}

	return &eyewearPrescriptionOrder, nil
}

func (r *mutationResolver) UpdateMedicationPrescription(ctx context.Context, input graph_models.MedicalPrescriptionUpdateInput) (*models.MedicalPrescription, error) {
	var entity models.MedicalPrescription
	deepCopy.Copy(&input).To(&entity)

	if err := r.MedicalPrescriptionRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateEyewearPrescription(ctx context.Context, input graph_models.EyewearPrescriptionUpdateInput) (*models.EyewearPrescription, error) {
	var entity models.EyewearPrescription
	deepCopy.Copy(&input).To(&entity)

	if err := r.EyewearPrescriptionRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteMedicalPrescription(ctx context.Context, id int) (bool, error) {
	var entity models.MedicalPrescription

	if err := r.MedicalPrescriptionRepository.Delete(&entity, id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeleteEyewearPrescription(ctx context.Context, id int) (bool, error) {
	if err := r.EyewearPrescriptionRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) UpdateMedicationPrescriptionOrder(ctx context.Context, input graph_models.MedicationPrescriptionUpdateInput) (*models.MedicalPrescriptionOrder, error) {
	var entity models.MedicalPrescriptionOrder
	deepCopy.Copy(&input).To(&entity)

	if err := r.MedicalPrescriptionOrderRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateEyewearPrescriptionOrder(ctx context.Context, input graph_models.EyewearPrescriptionOrderUpdateInput) (*models.EyewearPrescriptionOrder, error) {
	var entity models.EyewearPrescriptionOrder
	deepCopy.Copy(&input).To(&entity)

	if err := r.EyewearPrescriptionOrderRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) SearchMedicalPrescriptions(ctx context.Context, page models.PaginationInput, filter *graph_models.MedicalPrescriptionFilter, prescribedDate *time.Time, searchTerm *string) (*graph_models.MedicalPrescriptionConnection, error) {
	var f models.MedicalPrescription
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	entities, count, err := r.MedicalPrescriptionRepository.Search(page, &f, prescribedDate, searchTerm, false)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.MedicalPrescriptionEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.MedicalPrescriptionEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.MedicalPrescriptionConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) MedicationPrescriptionOrder(ctx context.Context, patientChartID int) (*models.MedicalPrescriptionOrder, error) {
	var entity models.MedicalPrescriptionOrder

	if err := r.MedicalPrescriptionOrderRepository.GetByPatientChartID(&entity, patientChartID); err != nil {
		return nil, nil
	}

	return &entity, nil
}

func (r *queryResolver) EyewearPrescriptionOrder(ctx context.Context, patientChartID int) (*models.EyewearPrescriptionOrder, error) {
	var entity models.EyewearPrescriptionOrder

	if err := r.EyewearPrescriptionOrderRepository.GetByPatientChartID(&entity, patientChartID); err != nil {
		return nil, nil
	}

	return &entity, nil
}

func (r *queryResolver) SearchMedicationPrescriptionOrders(ctx context.Context, page models.PaginationInput, filter *graph_models.PrescriptionOrdersFilter, prescribedDate *time.Time, searchTerm *string) (*graph_models.MedicalPrescriptionOrderConnection, error) {
	var f models.MedicalPrescriptionOrder
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	result, count, err := r.MedicalPrescriptionOrderRepository.Search(page, &f, prescribedDate, searchTerm, false)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.MedicalPrescriptionOrderEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.MedicalPrescriptionOrderEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.MedicalPrescriptionOrderConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) SearchEyewearPrescriptionOrders(ctx context.Context, page models.PaginationInput, filter *graph_models.PrescriptionOrdersFilter, prescribedDate *time.Time, searchTerm *string) (*graph_models.EyewearPrescriptionOrderConnection, error) {
	var f models.EyewearPrescriptionOrder
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	result, count, err := r.EyewearPrescriptionOrderRepository.Search(page, &f, prescribedDate, searchTerm, false)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.EyewearPrescriptionOrderEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.EyewearPrescriptionOrderEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.EyewearPrescriptionOrderConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
