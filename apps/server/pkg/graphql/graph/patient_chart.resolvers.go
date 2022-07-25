package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"

	graph_models "github.com/tensorsystems/tensoremr/apps/server/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SavePatientChart(ctx context.Context, input graph_models.PatientChartInput) (*models.PatientChart, error) {
	var entity models.PatientChart
	deepCopy.Copy(&input).To(&entity)

	if err := r.PatientChartRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdatePatientChart(ctx context.Context, input graph_models.PatientChartUpdateInput) (*models.PatientChart, error) {
	var entity models.PatientChart
	deepCopy.Copy(&input).To(&entity)

	if err := r.PatientChartRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeletePatientChart(ctx context.Context, id int) (bool, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) LockPatientChart(ctx context.Context, id int) (*models.PatientChart, error) {
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

	var entity models.PatientChart
	if err := r.PatientChartRepository.SignAndLock(&entity, id, &user.ID); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) SaveVitalSigns(ctx context.Context, input graph_models.VitalSignsInput) (*models.VitalSigns, error) {
	var entity models.VitalSigns
	deepCopy.Copy(&input).To(&entity)

	if err := r.VitalSignsRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateVitalSigns(ctx context.Context, input graph_models.VitalSignsUpdateInput) (*models.VitalSigns, error) {
	var entity models.VitalSigns
	deepCopy.Copy(&input).To(&entity)

	if err := r.VitalSignsRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) SaveOphthalmologyExam(ctx context.Context, input graph_models.OpthalmologyExamInput) (*models.OpthalmologyExam, error) {
	var entity models.OpthalmologyExam
	deepCopy.Copy(&input).To(&entity)

	if err := r.OpthalmologyExamRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateOphthalmologyExam(ctx context.Context, input graph_models.OpthalmologyExamUpdateInput) (*models.OpthalmologyExam, error) {
	var entity models.OpthalmologyExam
	deepCopy.Copy(&input).To(&entity)

	if err := r.OpthalmologyExamRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) PatientChart(ctx context.Context, id int, details *bool) (*models.PatientChart, error) {
	var patientChart models.PatientChart

	if details != nil && *details == true {
		if err := r.PatientChartRepository.GetWithDetails(&patientChart, id); err != nil {
			return nil, err
		}
	} else {
		if err := r.PatientChartRepository.Get(&patientChart, id); err != nil {
			return nil, err
		}
	}

	return &patientChart, nil
}

func (r *queryResolver) PatientCharts(ctx context.Context, page models.PaginationInput) (*graph_models.PatientChartConnection, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) VitalSigns(ctx context.Context, filter graph_models.VitalSignsFilter) (*models.VitalSigns, error) {
	var f models.VitalSigns
	deepCopy.Copy(&filter).To(&f)

	var entity models.VitalSigns
	if err := r.VitalSignsRepository.Get(&entity, f); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) OpthalmologyExam(ctx context.Context, filter graph_models.OphthalmologyExamFilter) (*models.OpthalmologyExam, error) {
	var f models.OpthalmologyExam
	deepCopy.Copy(&filter).To(&f)

	var entity models.OpthalmologyExam
	if err := r.OpthalmologyExamRepository.Get(&entity, f); err != nil {
		return nil, err
	}

	return &entity, nil
}
