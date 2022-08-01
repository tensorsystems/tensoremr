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

func (r *mutationResolver) SavePatientDiagnosis(ctx context.Context, input graph_models.PatientDiagnosisInput) (*models.PatientDiagnosis, error) {
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

	var entity models.PatientDiagnosis
	deepCopy.Copy(&input).To(&entity)

	if err := r.PatientDiagnosisRepository.Save(&entity, input.DiagnosisID); err != nil {
		return nil, err
	}

	r.Redis.Publish(ctx, "patient-diagnoses-update", entity.ID)

	return &entity, nil
}

func (r *mutationResolver) UpdatePatientDiagnosis(ctx context.Context, input graph_models.PatientDiagnosisUpdateInput) (*models.PatientDiagnosis, error) {
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

	var entity models.PatientDiagnosis
	deepCopy.Copy(&input).To(&entity)

	if err := r.PatientDiagnosisRepository.Update(&entity); err != nil {
		return nil, err
	}

	r.Redis.Publish(ctx, "patient-diagnoses-update", entity.ID)

	return &entity, nil
}

func (r *mutationResolver) DeletePatientDiagnosis(ctx context.Context, id int) (bool, error) {
	// Get current user
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

	isPhysician := false
	for _, e := range user.UserTypes {
		if e.Title == "Physician" {
			isPhysician = true
		}
	}

	if !isPhysician {
		return false, errors.New("You are not authorized to perform this action")
	}

	if err := r.PatientDiagnosisRepository.Delete(id); err != nil {
		return false, err
	}

	r.Redis.Publish(ctx, "patient-diagnoses-delete", id)

	return true, nil
}

func (r *queryResolver) PatientDiagnoses(ctx context.Context, page models.PaginationInput, filter *graph_models.PatientDiagnosisFilter) (*graph_models.PatientDiagnosisConnection, error) {
	var f models.PatientDiagnosis
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	diagnoses, count, err := r.PatientDiagnosisRepository.GetAll(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.PatientDiagnosisEdge, len(diagnoses))

	for i, entity := range diagnoses {
		e := entity

		edges[i] = &graph_models.PatientDiagnosisEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(diagnoses, count, page)
	return &graph_models.PatientDiagnosisConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) SearchPatientDiagnosis(ctx context.Context, searchTerm *string, page models.PaginationInput) (*graph_models.PatientDiagnosisConnection, error) {
	panic(fmt.Errorf("not implemented"))
}
