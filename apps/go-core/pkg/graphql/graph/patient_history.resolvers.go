package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"

	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/generated"
	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SavePastIllness(ctx context.Context, input graph_models.PastIllnessInput) (*models.ClinicalFinding, error) {
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

	var findings []models.ClinicalFinding
	for _, e := range resp.Attributes {
		var clinicalFinding models.ClinicalFinding
		// clinicalFinding.PatientChartID = patientChart.ID
		// clinicalFinding.PatientID = appointment.PatientID
		// clinicalFinding.ConceptID = input.ConceptID
		// clinicalFinding.ParentConceptID = "312850006"
		// clinicalFinding.ConceptTerm = input.Term
		// clinicalFinding.AttributeTypeID = e.RelationshipTypeId
		// clinicalFinding.AttributeID = e.Association.Sctid
		// clinicalFinding.AttributeTerm = e.Description.Term
		// clinicalFinding.CreatedByID = user.ID
		// clinicalFinding.UpdatedByID = user.ID
		// clinicalFinding.Memo = input.Memo

		fmt.Println(e)

		findings = append(findings, clinicalFinding)
	}

	if err := r.ClinicalFindingRepository.SaveBatch(findings); err != nil {
		return nil, err
	}

	return &findings[0], nil
}

func (r *mutationResolver) SavePastInjury(ctx context.Context, input graph_models.PastInjuryInput) (*models.PastInjury, error) {
	var entity models.PastInjury
	deepCopy.Copy(&input).To(&entity)

	if err := r.PastInjuryRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) SavePastHospitalization(ctx context.Context, input graph_models.PastHospitalizationInput) (*models.PastHospitalization, error) {
	var entity models.PastHospitalization
	deepCopy.Copy(&input).To(&entity)

	if err := r.PastHospitalizationRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) SavePastSurgery(ctx context.Context, input graph_models.PastSurgeryInput) (*models.PastSurgery, error) {
	var entity models.PastSurgery
	deepCopy.Copy(&input).To(&entity)

	if err := r.PastSurgeryRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) SaveLifestyle(ctx context.Context, input graph_models.LifestyleInput) (*models.Lifestyle, error) {
	var entity models.Lifestyle
	deepCopy.Copy(&input).To(&entity)

	if err := r.LifestyleRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) SaveFamilyIllness(ctx context.Context, input graph_models.FamilyIllnessInput) (*models.FamilyIllness, error) {
	var entity models.FamilyIllness
	deepCopy.Copy(&input).To(&entity)

	if err := r.FamilyIllnessRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdatePatientHistory(ctx context.Context, input graph_models.PatientHistoryUpdateInput) (*models.PatientHistory, error) {
	var entity models.PatientHistory
	deepCopy.Copy(&input).To(&entity)

	if err := r.PatientHistoryRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdatePastIllness(ctx context.Context, input graph_models.PastIllnessUpdateInput) (*models.ClinicalFinding, error) {
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

	var finding models.ClinicalFinding
	// finding.Memo = input.Memo

	if err := r.ClinicalFindingRepository.UpdateByConceptId(input.ConceptID, &finding); err != nil {
		return nil, err
	}

	return &finding, nil
}

func (r *mutationResolver) UpdatePastInjury(ctx context.Context, input graph_models.PastInjuryUpdateInput) (*models.PastInjury, error) {
	var entity models.PastInjury
	deepCopy.Copy(&input).To(&entity)

	if err := r.PastInjuryRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdatePastHospitalization(ctx context.Context, input graph_models.PastHospitalizationUpdateInput) (*models.PastHospitalization, error) {
	var entity models.PastHospitalization
	deepCopy.Copy(&input).To(&entity)

	if err := r.PastHospitalizationRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdatePastSurgery(ctx context.Context, input graph_models.PastSurgeryUpdateInput) (*models.PastSurgery, error) {
	var entity models.PastSurgery
	deepCopy.Copy(&input).To(&entity)

	if err := r.PastSurgeryRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateLifestyle(ctx context.Context, input graph_models.LifestyleUpdateInput) (*models.Lifestyle, error) {
	var entity models.Lifestyle
	deepCopy.Copy(&input).To(&entity)

	if err := r.LifestyleRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateFamilyIllness(ctx context.Context, input graph_models.FamilyIllnessUpdateInput) (*models.FamilyIllness, error) {
	var entity models.FamilyIllness
	deepCopy.Copy(&input).To(&entity)

	if err := r.FamilyIllnessRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeletePastIllness(ctx context.Context, conceptID string) (bool, error) {
	if err := r.ClinicalFindingRepository.DeleteByConceptId(conceptID); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeletePastInjury(ctx context.Context, id int) (bool, error) {
	if err := r.PastInjuryRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeletePastHospitalization(ctx context.Context, id int) (bool, error) {
	if err := r.PastHospitalizationRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeletePastSurgery(ctx context.Context, id int) (bool, error) {
	if err := r.PastSurgeryRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeleteLifestyle(ctx context.Context, id int) (bool, error) {
	if err := r.LifestyleRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeleteFamilyIllness(ctx context.Context, id int) (bool, error) {
	if err := r.FamilyIllnessRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *patientHistoryResolver) Lifestyle(ctx context.Context, obj *models.PatientHistory) ([]*models.Lifestyle, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) PatientHistory(ctx context.Context, id int) (*models.PatientHistory, error) {
	var entity models.PatientHistory

	if err := r.PatientHistoryRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) PastIllnesses(ctx context.Context, patientHistoryID int) ([]*models.PastIllness, error) {
	result, err := r.PastIllnessRepository.GetByPatientHistoryID(patientHistoryID)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (r *queryResolver) PastInjuries(ctx context.Context, patientHistoryID int) ([]*models.PastInjury, error) {
	result, err := r.PastInjuryRepository.GetByPatientHistoryID(patientHistoryID)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (r *queryResolver) PastHospitalizations(ctx context.Context, patientHistoryID int) ([]*models.PastHospitalization, error) {
	result, err := r.PastHospitalizationRepository.GetByPatientHistoryID(patientHistoryID)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (r *queryResolver) PastSurgeries(ctx context.Context, patientHistoryID int) ([]*models.PastSurgery, error) {
	result, err := r.PastSurgeryRepository.GetByPatientHistoryID(patientHistoryID)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (r *queryResolver) Lifestyles(ctx context.Context, patientHistoryID int) ([]*models.Lifestyle, error) {
	result, err := r.LifestyleRepository.GetByPatientHistoryID(patientHistoryID)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (r *queryResolver) FamilyIllnesses(ctx context.Context, patientHistoryID int) ([]*models.FamilyIllness, error) {
	result, err := r.FamilyIllnessRepository.GetByPatientHistoryID(patientHistoryID)
	if err != nil {
		return nil, err
	}

	return result, nil
}

// PatientHistory returns generated.PatientHistoryResolver implementation.
func (r *Resolver) PatientHistory() generated.PatientHistoryResolver {
	return &patientHistoryResolver{r}
}

type patientHistoryResolver struct{ *Resolver }
