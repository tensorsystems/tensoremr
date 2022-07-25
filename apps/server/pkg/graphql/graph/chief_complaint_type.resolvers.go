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

func (r *mutationResolver) SaveChiefComplaintType(ctx context.Context, input graph_models.ChiefComplaintTypeInput) (*models.ChiefComplaintType, error) {
	var entity models.ChiefComplaintType
	deepCopy.Copy(&input).To(&entity)

	if err := r.ChiefComplaintTypeRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateChiefComplaintType(ctx context.Context, input graph_models.ChiefComplaintTypeUpdateInput) (*models.ChiefComplaintType, error) {
	var entity models.ChiefComplaintType
	deepCopy.Copy(&input).To(&entity)

	if err := r.ChiefComplaintTypeRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteChiefComplaintType(ctx context.Context, id int) (bool, error) {
	if err := r.ChiefComplaintTypeRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) ChiefComplaintType(ctx context.Context, id int) (*models.ChiefComplaintType, error) {
	var entity models.ChiefComplaintType

	if err := r.ChiefComplaintTypeRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) ChiefComplaintTypes(ctx context.Context, page models.PaginationInput, searchTerm *string, favorites *bool) (*graph_models.ChiefComplaintTypeConnection, error) {
	gc, err := middleware.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	email := gc.GetString("email")
	if len(email) == 0 {
		return nil, errors.New("Cannot find user")
	}

	var user models.User
	err = r.UserRepository.GetByEmail(&user, email)
	if err != nil {
		return nil, err
	}

	var result []models.ChiefComplaintType
	var count int64

	if favorites != nil && *favorites == true {
		result, count, err = r.ChiefComplaintTypeRepository.GetFavorites(page, searchTerm, user.ID)
		if err != nil {
			return nil, err
		}
	} else {
		result, count, err = r.ChiefComplaintTypeRepository.GetAll(page, searchTerm)
		if err != nil {
			return nil, err
		}
	}

	edges := make([]*graph_models.ChiefComplaintTypeEdge, len(result))

	for i, entity := range result {
		e := entity

		edges[i] = &graph_models.ChiefComplaintTypeEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(result, count, page)
	return &graph_models.ChiefComplaintTypeConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
