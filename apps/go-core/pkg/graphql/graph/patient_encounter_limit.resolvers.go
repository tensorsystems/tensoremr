package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SavePatientEncounterLimit(ctx context.Context, input graph_models.PatientEncounterLimitInput) (*models.PatientEncounterLimit, error) {
	var entity models.PatientEncounterLimit
	deepCopy.Copy(&input).To(&entity)

	entity.Overbook = 5

	if err := r.PatientEncounterLimitRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdatePatientEncounterLimit(ctx context.Context, input graph_models.PatientEncounterLimitUpdateInput) (*models.PatientEncounterLimit, error) {
	var entity models.PatientEncounterLimit
	deepCopy.Copy(&input).To(&entity)

	if err := r.PatientEncounterLimitRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeletePatientEncounterLimit(ctx context.Context, id int) (bool, error) {
	if err := r.PatientEncounterLimitRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) PatientEncounterLimit(ctx context.Context, id int) (*models.PatientEncounterLimit, error) {
	var entity models.PatientEncounterLimit

	if err := r.PatientEncounterLimitRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) PatientEncounterLimits(ctx context.Context, page models.PaginationInput) (*graph_models.PatientEncounterLimitConnection, error) {
	result, count, err := r.PatientEncounterLimitRepository.GetAll(page)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.PatientEncounterLimitEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.PatientEncounterLimitEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.PatientEncounterLimitConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) PatientEncounterLimitByUser(ctx context.Context, userID int) (*models.PatientEncounterLimit, error) {
	var entity models.PatientEncounterLimit

	if err := r.PatientEncounterLimitRepository.GetByUser(&entity, userID); err != nil {
		return nil, err
	}

	return &entity, nil
}
