package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) DeleteClinicalFinding(ctx context.Context, id int) (bool, error) {
	gc, err := middleware.GinContextFromContext(ctx)
	if err != nil {
		return false, err
	}

	email := gc.GetString("email")
	if len(email) == 0 {
		return false, errors.New("Cannot find user")
	}

	var user models.User
	if err := r.UserRepository.GetByEmail(&user, email); err != nil {
		return false, err
	}

	if err := r.ClinicalFindingRepository.Update(&models.ClinicalFinding{ID: id, Audit: models.Audit{UpdatedByID: &user.ID}}); err != nil {
		return false, err
	}

	if err := r.ClinicalFindingAttributeRepository.Update(&models.ClinicalFindingAttribute{ID: id, Audit: models.Audit{UpdatedByID: &user.ID}}); err != nil {
		return false, err
	}

	if err := r.ClinicalFindingRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) SaveDisorderHistory(ctx context.Context, input graph_models.ClinicalFindingInput) (*models.ClinicalFinding, error) {
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

	resp, err := r.TerminologyService.GetConceptAttributes(input.ConceptID)
	if err != nil {
		return nil, err
	}

	var patientChart models.PatientChart
	if err := r.PatientChartRepository.Get(&patientChart, input.PatientChartID); err != nil {
		return nil, err
	}

	var appointment models.Appointment
	if err := r.AppointmentRepository.Get(&appointment, patientChart.AppointmentID); err != nil {
		return nil, err
	}

	var attributes []models.ClinicalFindingAttribute
	for _, e := range resp.Attributes {
		attributes = append(attributes, models.ClinicalFindingAttribute{
			AttributeTypeID: e.RelationshipTypeId,
			AttributeID:     e.Association.Sctid,
			AttributeTerm:   e.Description.Term,
			Audit: models.Audit{
				CreatedByID: user.ID,
			},
			Authority: "net.tensorsystems.tensoremr",
		})
	}

	parentConceptTerm := "312850006"
	for _, e := range attributes {
		if e.AttributeTypeID == "408729009" {
			// Negative context type
			if e.AttributeID == "410516002" {
				parentConceptTerm = "443508001"
			}
		}
	}

	var clinicalFinding models.ClinicalFinding
	clinicalFinding.PatientChartID = patientChart.ID
	clinicalFinding.PatientID = appointment.PatientID
	clinicalFinding.ConceptID = &input.ConceptID
	clinicalFinding.ParentConceptID = &parentConceptTerm
	clinicalFinding.ConceptTerm = input.Term
	clinicalFinding.CreatedByID = user.ID
	clinicalFinding.FreeTextNote = input.FreeTextNote
	clinicalFinding.Attributes = attributes
	clinicalFinding.Authority = "net.tensorsystems.tensoremr"

	if err := r.ClinicalFindingRepository.Save(&clinicalFinding); err != nil {
		return nil, err
	}

	return &clinicalFinding, nil
}

func (r *mutationResolver) UpdateDisorderHistory(ctx context.Context, input graph_models.ClinicalFindingUpdateInput) (*models.ClinicalFinding, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) SaveSurgicalHistory(ctx context.Context, input graph_models.ClinicalFindingInput) (*models.ClinicalFinding, error) {
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

	resp, err := r.TerminologyService.GetConceptAttributes(input.ConceptID)
	if err != nil {
		return nil, err
	}

	var patientChart models.PatientChart
	if err := r.PatientChartRepository.Get(&patientChart, input.PatientChartID); err != nil {
		return nil, err
	}

	var appointment models.Appointment
	if err := r.AppointmentRepository.Get(&appointment, patientChart.AppointmentID); err != nil {
		return nil, err
	}

	var attributes []models.ClinicalFindingAttribute
	for _, e := range resp.Attributes {
		attributes = append(attributes, models.ClinicalFindingAttribute{
			AttributeTypeID: e.RelationshipTypeId,
			AttributeID:     e.Association.Sctid,
			AttributeTerm:   e.Description.Term,
			Audit: models.Audit{
				CreatedByID: user.ID,
			},
			Authority: "net.tensorsystems.tensoremr",
		})
	}

	attributes = append(attributes, models.ClinicalFindingAttribute{
		AttributeTypeID: "408731000",
		AttributeID:     "410513005",
		AttributeTerm:   "Past",
		Audit:           models.Audit{CreatedByID: user.ID},
		Authority:       "net.tensorsystems.tensoremr",
	})

	parentConceptTerm := "387713003"

	var clinicalFinding models.ClinicalFinding
	clinicalFinding.PatientChartID = patientChart.ID
	clinicalFinding.PatientID = appointment.PatientID
	clinicalFinding.ConceptID = &input.ConceptID
	clinicalFinding.ParentConceptID = &parentConceptTerm
	clinicalFinding.ConceptTerm = input.Term
	clinicalFinding.CreatedByID = user.ID
	clinicalFinding.FreeTextNote = input.FreeTextNote
	clinicalFinding.Attributes = attributes
	clinicalFinding.Authority = "net.tensorsystems.tensoremr"

	if err := r.ClinicalFindingRepository.Save(&clinicalFinding); err != nil {
		return nil, err
	}

	return &clinicalFinding, nil
}

func (r *mutationResolver) UpdateSurgicalHistory(ctx context.Context, input graph_models.ClinicalFindingUpdateInput) (*models.ClinicalFinding, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) SaveMentalHistory(ctx context.Context, input graph_models.ClinicalFindingInput) (*models.ClinicalFinding, error) {
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

	resp, err := r.TerminologyService.GetConceptAttributes(input.ConceptID)
	if err != nil {
		return nil, err
	}

	var patientChart models.PatientChart
	if err := r.PatientChartRepository.Get(&patientChart, input.PatientChartID); err != nil {
		return nil, err
	}

	var appointment models.Appointment
	if err := r.AppointmentRepository.Get(&appointment, patientChart.AppointmentID); err != nil {
		return nil, err
	}

	var attributes []models.ClinicalFindingAttribute
	for _, e := range resp.Attributes {
		attributes = append(attributes, models.ClinicalFindingAttribute{
			AttributeTypeID: e.RelationshipTypeId,
			AttributeID:     e.Association.Sctid,
			AttributeTerm:   e.Description.Term,
			Audit: models.Audit{
				CreatedByID: user.ID,
			},
			Authority: "net.tensorsystems.tensoremr",
		})
	}

	parentConceptTerm := "36456004"

	var clinicalFinding models.ClinicalFinding
	clinicalFinding.PatientChartID = patientChart.ID
	clinicalFinding.PatientID = appointment.PatientID
	clinicalFinding.ConceptID = &input.ConceptID
	clinicalFinding.ParentConceptID = &parentConceptTerm
	clinicalFinding.ConceptTerm = input.Term
	clinicalFinding.CreatedByID = user.ID
	clinicalFinding.FreeTextNote = input.FreeTextNote
	clinicalFinding.Attributes = attributes
	clinicalFinding.Authority = "net.tensorsystems.tensoremr"

	if err := r.ClinicalFindingRepository.Save(&clinicalFinding); err != nil {
		return nil, err
	}

	return &clinicalFinding, nil
}

func (r *mutationResolver) UpdateMentalHistory(ctx context.Context, input graph_models.ClinicalFindingUpdateInput) (*models.ClinicalFinding, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) SaveImmunizationHistory(ctx context.Context, input graph_models.ClinicalFindingInput) (*models.ClinicalFinding, error) {
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

	resp, err := r.TerminologyService.GetConceptAttributes(input.ConceptID)
	if err != nil {
		return nil, err
	}

	var patientChart models.PatientChart
	if err := r.PatientChartRepository.Get(&patientChart, input.PatientChartID); err != nil {
		return nil, err
	}

	var appointment models.Appointment
	if err := r.AppointmentRepository.Get(&appointment, patientChart.AppointmentID); err != nil {
		return nil, err
	}

	var attributes []models.ClinicalFindingAttribute
	for _, e := range resp.Attributes {
		attributes = append(attributes, models.ClinicalFindingAttribute{
			AttributeTypeID: e.RelationshipTypeId,
			AttributeID:     e.Association.Sctid,
			AttributeTerm:   e.Description.Term,
			Audit: models.Audit{
				CreatedByID: user.ID,
			},
			Authority: "net.tensorsystems.tensoremr",
		})
	}

	parentConceptTerm := "127785005"

	var clinicalFinding models.ClinicalFinding
	clinicalFinding.PatientChartID = patientChart.ID
	clinicalFinding.PatientID = appointment.PatientID
	clinicalFinding.ConceptID = &input.ConceptID
	clinicalFinding.ParentConceptID = &parentConceptTerm
	clinicalFinding.ConceptTerm = input.Term
	clinicalFinding.CreatedByID = user.ID
	clinicalFinding.FreeTextNote = input.FreeTextNote
	clinicalFinding.Attributes = attributes
	clinicalFinding.Authority = "net.tensorsystems.tensoremr"

	if err := r.ClinicalFindingRepository.Save(&clinicalFinding); err != nil {
		return nil, err
	}

	return &clinicalFinding, nil
}

func (r *mutationResolver) UpdateImmunizationHistory(ctx context.Context, input graph_models.ClinicalFindingUpdateInput) (*models.ClinicalFinding, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) SaveAllergyHistory(ctx context.Context, input graph_models.ClinicalFindingInput) (*models.ClinicalFinding, error) {
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

	resp, err := r.TerminologyService.GetConceptAttributes(input.ConceptID)
	if err != nil {
		return nil, err
	}

	var patientChart models.PatientChart
	if err := r.PatientChartRepository.Get(&patientChart, input.PatientChartID); err != nil {
		return nil, err
	}

	var appointment models.Appointment
	if err := r.AppointmentRepository.Get(&appointment, patientChart.AppointmentID); err != nil {
		return nil, err
	}

	var attributes []models.ClinicalFindingAttribute
	for _, e := range resp.Attributes {
		attributes = append(attributes, models.ClinicalFindingAttribute{
			AttributeTypeID: e.RelationshipTypeId,
			AttributeID:     e.Association.Sctid,
			AttributeTerm:   e.Description.Term,
			Audit: models.Audit{
				CreatedByID: user.ID,
			},
			Authority: "net.tensorsystems.tensoremr",
		})
	}

	parentConceptTerm := "473011001"

	var clinicalFinding models.ClinicalFinding
	clinicalFinding.PatientChartID = patientChart.ID
	clinicalFinding.PatientID = appointment.PatientID
	clinicalFinding.ConceptID = &input.ConceptID
	clinicalFinding.ParentConceptID = &parentConceptTerm
	clinicalFinding.ConceptTerm = input.Term
	clinicalFinding.CreatedByID = user.ID
	clinicalFinding.FreeTextNote = input.FreeTextNote
	clinicalFinding.Attributes = attributes
	clinicalFinding.Authority = "net.tensorsystems.tensoremr"

	if err := r.ClinicalFindingRepository.Save(&clinicalFinding); err != nil {
		return nil, err
	}

	return &clinicalFinding, nil
}

func (r *mutationResolver) UpdateAllergyHistory(ctx context.Context, input graph_models.ClinicalFindingUpdateInput) (*models.ClinicalFinding, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) SaveIntoleranceHistory(ctx context.Context, input graph_models.ClinicalFindingInput) (*models.ClinicalFinding, error) {
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

	resp, err := r.TerminologyService.GetConceptAttributes(input.ConceptID)
	if err != nil {
		return nil, err
	}

	var patientChart models.PatientChart
	if err := r.PatientChartRepository.Get(&patientChart, input.PatientChartID); err != nil {
		return nil, err
	}

	var appointment models.Appointment
	if err := r.AppointmentRepository.Get(&appointment, patientChart.AppointmentID); err != nil {
		return nil, err
	}

	var attributes []models.ClinicalFindingAttribute
	for _, e := range resp.Attributes {
		attributes = append(attributes, models.ClinicalFindingAttribute{
			AttributeTypeID: e.RelationshipTypeId,
			AttributeID:     e.Association.Sctid,
			AttributeTerm:   e.Description.Term,
			Audit: models.Audit{
				CreatedByID: user.ID,
			},
			Authority: "net.tensorsystems.tensoremr",
		})
	}

	parentConceptTerm := "782197009"

	var clinicalFinding models.ClinicalFinding
	clinicalFinding.PatientChartID = patientChart.ID
	clinicalFinding.PatientID = appointment.PatientID
	clinicalFinding.ConceptID = &input.ConceptID
	clinicalFinding.ParentConceptID = &parentConceptTerm
	clinicalFinding.ConceptTerm = input.Term
	clinicalFinding.CreatedByID = user.ID
	clinicalFinding.FreeTextNote = input.FreeTextNote
	clinicalFinding.Attributes = attributes
	clinicalFinding.Authority = "net.tensorsystems.tensoremr"

	if err := r.ClinicalFindingRepository.Save(&clinicalFinding); err != nil {
		return nil, err
	}

	return &clinicalFinding, nil
}

func (r *mutationResolver) UpdateIntoleranceHistory(ctx context.Context, input graph_models.ClinicalFindingUpdateInput) (*models.ClinicalFinding, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) SavePatientHospitalizationHistory(ctx context.Context, input graph_models.ClinicalFindingInput) (*models.ClinicalFinding, error) {
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

	resp, err := r.TerminologyService.GetConceptAttributes(input.ConceptID)
	if err != nil {
		return nil, err
	}

	var patientChart models.PatientChart
	if err := r.PatientChartRepository.Get(&patientChart, input.PatientChartID); err != nil {
		return nil, err
	}

	var appointment models.Appointment
	if err := r.AppointmentRepository.Get(&appointment, patientChart.AppointmentID); err != nil {
		return nil, err
	}

	var attributes []models.ClinicalFindingAttribute
	for _, e := range resp.Attributes {
		attributes = append(attributes, models.ClinicalFindingAttribute{
			AttributeTypeID: e.RelationshipTypeId,
			AttributeID:     e.Association.Sctid,
			AttributeTerm:   e.Description.Term,
			Audit: models.Audit{
				CreatedByID: user.ID,
			},
			Authority: "net.tensorsystems.tensoremr",
		})
	}

	parentConceptTerm := "32485007"

	hasPastAttribute := false
	for _, e := range attributes {
		if e.AttributeTypeID == "408731000" {
			hasPastAttribute = true
		}
	}

	if !hasPastAttribute {
		attributes = append(attributes, models.ClinicalFindingAttribute{
			AttributeTypeID: "408731000",
			AttributeID:     "410513005",
			AttributeTerm:   "Past",
			Audit:           models.Audit{CreatedByID: user.ID},
			Authority:       "net.tensorsystems.tensoremr",
		})
	}

	var clinicalFinding models.ClinicalFinding
	clinicalFinding.PatientChartID = patientChart.ID
	clinicalFinding.PatientID = appointment.PatientID
	clinicalFinding.ConceptID = &input.ConceptID
	clinicalFinding.ParentConceptID = &parentConceptTerm
	clinicalFinding.ConceptTerm = input.Term
	clinicalFinding.CreatedByID = user.ID
	clinicalFinding.FreeTextNote = input.FreeTextNote
	clinicalFinding.Attributes = attributes
	clinicalFinding.Authority = "net.tensorsystems.tensoremr"

	if err := r.ClinicalFindingRepository.Save(&clinicalFinding); err != nil {
		return nil, err
	}

	return &clinicalFinding, nil
}

func (r *mutationResolver) SavePatientClinicalFindingHistory(ctx context.Context, input graph_models.ClinicalFindingInput) (*models.ClinicalFinding, error) {
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

	resp, err := r.TerminologyService.GetConceptAttributes(input.ConceptID)
	if err != nil {
		return nil, err
	}

	var patientChart models.PatientChart
	if err := r.PatientChartRepository.Get(&patientChart, input.PatientChartID); err != nil {
		return nil, err
	}

	var appointment models.Appointment
	if err := r.AppointmentRepository.Get(&appointment, patientChart.AppointmentID); err != nil {
		return nil, err
	}

	var attributes []models.ClinicalFindingAttribute
	for _, e := range resp.Attributes {
		attributes = append(attributes, models.ClinicalFindingAttribute{
			AttributeTypeID: e.RelationshipTypeId,
			AttributeID:     e.Association.Sctid,
			AttributeTerm:   e.Description.Term,
			Audit: models.Audit{
				CreatedByID: user.ID,
			},
			Authority: "net.tensorsystems.tensoremr",
		})
	}

	parentConceptTerm := "417662000"

	hasPastAttribute := false
	for _, e := range attributes {
		if e.AttributeTypeID == "408731000" {
			hasPastAttribute = true
		}
	}

	if !hasPastAttribute {
		attributes = append(attributes, models.ClinicalFindingAttribute{
			AttributeTypeID: "408731000",
			AttributeID:     "410513005",
			AttributeTerm:   "Past",
			Audit:           models.Audit{CreatedByID: user.ID},
			Authority:       "net.tensorsystems.tensoremr",
		})
	}

	var clinicalFinding models.ClinicalFinding
	clinicalFinding.PatientChartID = patientChart.ID
	clinicalFinding.PatientID = appointment.PatientID
	clinicalFinding.ConceptID = &input.ConceptID
	clinicalFinding.ParentConceptID = &parentConceptTerm
	clinicalFinding.ConceptTerm = input.Term
	clinicalFinding.CreatedByID = user.ID
	clinicalFinding.FreeTextNote = input.FreeTextNote
	clinicalFinding.Attributes = attributes
	clinicalFinding.Authority = "net.tensorsystems.tensoremr"

	if err := r.ClinicalFindingRepository.Save(&clinicalFinding); err != nil {
		return nil, err
	}

	return &clinicalFinding, nil
}

func (r *queryResolver) PatientDisorderHistory(ctx context.Context, page models.PaginationInput, filter *graph_models.ClinicalFindingFilter) (*graph_models.ClinicalFindingConnection, error) {
	var f models.ClinicalFinding
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	findings, count, err := r.ClinicalFindingRepository.GetPastDisorders(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ClinicalFindingEdge, len(findings))

	for i, entity := range findings {
		e := entity

		edges[i] = &graph_models.ClinicalFindingEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(findings, count, page)
	return &graph_models.ClinicalFindingConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) PatientSurgicalHistory(ctx context.Context, page models.PaginationInput, filter *graph_models.ClinicalFindingFilter) (*graph_models.ClinicalFindingConnection, error) {
	var f models.ClinicalFinding
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	findings, count, err := r.ClinicalFindingRepository.GetSurgicalHistory(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ClinicalFindingEdge, len(findings))

	for i, entity := range findings {
		e := entity

		edges[i] = &graph_models.ClinicalFindingEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(findings, count, page)
	return &graph_models.ClinicalFindingConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) PatientMentalHistory(ctx context.Context, page models.PaginationInput, filter *graph_models.ClinicalFindingFilter) (*graph_models.ClinicalFindingConnection, error) {
	var f models.ClinicalFinding
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	findings, count, err := r.ClinicalFindingRepository.GetMentalHistory(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ClinicalFindingEdge, len(findings))

	for i, entity := range findings {
		e := entity

		edges[i] = &graph_models.ClinicalFindingEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(findings, count, page)
	return &graph_models.ClinicalFindingConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) PatientImmunizationHistory(ctx context.Context, page models.PaginationInput, filter *graph_models.ClinicalFindingFilter) (*graph_models.ClinicalFindingConnection, error) {
	var f models.ClinicalFinding
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	findings, count, err := r.ClinicalFindingRepository.GetImmunizationHistory(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ClinicalFindingEdge, len(findings))

	for i, entity := range findings {
		e := entity

		edges[i] = &graph_models.ClinicalFindingEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(findings, count, page)
	return &graph_models.ClinicalFindingConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) PatientAllergyHistory(ctx context.Context, page models.PaginationInput, filter *graph_models.ClinicalFindingFilter) (*graph_models.ClinicalFindingConnection, error) {
	var f models.ClinicalFinding
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	findings, count, err := r.ClinicalFindingRepository.GetAllergyHistory(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ClinicalFindingEdge, len(findings))

	for i, entity := range findings {
		e := entity

		edges[i] = &graph_models.ClinicalFindingEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(findings, count, page)
	return &graph_models.ClinicalFindingConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) PatientIntoleranceHistory(ctx context.Context, page models.PaginationInput, filter *graph_models.ClinicalFindingFilter) (*graph_models.ClinicalFindingConnection, error) {
	var f models.ClinicalFinding
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	findings, count, err := r.ClinicalFindingRepository.GetIntoleranceHistory(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ClinicalFindingEdge, len(findings))

	for i, entity := range findings {
		e := entity

		edges[i] = &graph_models.ClinicalFindingEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(findings, count, page)
	return &graph_models.ClinicalFindingConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) PatientHospitalizationHistory(ctx context.Context, page models.PaginationInput, filter *graph_models.ClinicalFindingFilter) (*graph_models.ClinicalFindingConnection, error) {
	var f models.ClinicalFinding
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	findings, count, err := r.ClinicalFindingRepository.GetHospitalizationHistory(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ClinicalFindingEdge, len(findings))

	for i, entity := range findings {
		e := entity

		edges[i] = &graph_models.ClinicalFindingEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(findings, count, page)
	return &graph_models.ClinicalFindingConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) PatientClinicalFindingHistory(ctx context.Context, page models.PaginationInput, filter *graph_models.ClinicalFindingFilter) (*graph_models.ClinicalFindingConnection, error) {
	var f models.ClinicalFinding
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	findings, count, err := r.ClinicalFindingRepository.GetClinicalFindingHistory(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ClinicalFindingEdge, len(findings))

	for i, entity := range findings {
		e := entity

		edges[i] = &graph_models.ClinicalFindingEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(findings, count, page)
	return &graph_models.ClinicalFindingConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
