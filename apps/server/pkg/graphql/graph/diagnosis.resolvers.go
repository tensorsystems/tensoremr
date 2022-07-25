package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"

	graph_models "github.com/tensorsystems/tensoremr/apps/server/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SaveDiagnosis(ctx context.Context, input graph_models.DiagnosisInput) (*models.Diagnosis, error) {
	var entity models.Diagnosis
	deepCopy.Copy(&input).To(&entity)

	if err := r.DiagnosisRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateDiagnosis(ctx context.Context, input graph_models.DiagnosisUpdateInput) (*models.Diagnosis, error) {
	var entity models.Diagnosis
	deepCopy.Copy(&input).To(&entity)

	if err := r.DiagnosisRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteDiagnosis(ctx context.Context, id int) (bool, error) {
	if err := r.DiagnosisRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) Diagnoses(ctx context.Context, page models.PaginationInput, searchTerm *string, favorites *bool) (*graph_models.DiagnosisConnection, error) {
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

	var result []models.Diagnosis
	var count int64

	if favorites != nil && *favorites == true {
		result, count, err = r.DiagnosisRepository.GetFavorites(page, searchTerm, user.ID)
		if err != nil {
			return nil, err
		}
	} else {
		result, count, err = r.DiagnosisRepository.GetAll(page, searchTerm)
		if err != nil {
			return nil, err
		}
	}

	edges := make([]*graph_models.DiagnosisEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.DiagnosisEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.DiagnosisConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
