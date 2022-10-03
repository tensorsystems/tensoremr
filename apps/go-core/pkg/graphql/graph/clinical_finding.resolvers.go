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
)

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

	parentConceptTerm := "312850006"

	var attributes []models.ClinicalFindingAttribute
	for _, e := range resp.Attributes {
		attributes = append(attributes, models.ClinicalFindingAttribute{
			AttributeTypeID: e.RelationshipTypeId,
			AttributeID:     e.Association.Sctid,
			AttributeTerm:   e.Description.Term,
			CreatedByID:     user.ID,
		})
	}

	var clinicalFinding models.ClinicalFinding
	clinicalFinding.PatientChartID = patientChart.ID
	clinicalFinding.PatientID = appointment.PatientID
	clinicalFinding.ConceptID = &input.ConceptID
	clinicalFinding.ParentConceptID = &parentConceptTerm
	clinicalFinding.ConceptTerm = input.Term
	clinicalFinding.CreatedByID = user.ID
	clinicalFinding.UpdatedByID = user.ID
	clinicalFinding.FreeTextNote = input.FreeTextNote
	clinicalFinding.Attributes = attributes

	if err := r.ClinicalFindingRepository.Save(&clinicalFinding); err != nil {
		return nil, err
	}

	return &clinicalFinding, nil
}

func (r *mutationResolver) SaveSurgicalHistory(ctx context.Context, input graph_models.ClinicalFindingInput) (*models.ClinicalFinding, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) SaveMentalHistory(ctx context.Context, input graph_models.ClinicalFindingInput) (*models.ClinicalFinding, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) SaveImmunizationHistory(ctx context.Context, input graph_models.ClinicalFindingInput) (*models.ClinicalFinding, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) SaveAllergyHistory(ctx context.Context, input graph_models.ClinicalFindingInput) (*models.ClinicalFinding, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) SaveIntoleranceHistory(ctx context.Context, input graph_models.ClinicalFindingInput) (*models.ClinicalFinding, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) UpdateDisorderHistory(ctx context.Context, input graph_models.ClinicalFindingUpdateInput) (*models.ClinicalFinding, error) {
	panic(fmt.Errorf("not implemented"))
}
