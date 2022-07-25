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

func (r *mutationResolver) SaveFavoriteMedication(ctx context.Context, input graph_models.FavoriteMedicationInput) (*models.FavoriteMedication, error) {
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

	var entity models.FavoriteMedication
	deepCopy.Copy(&input).To(&entity)

	entity.UserID = user.ID

	if err := r.FavoriteMedicationRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateFavoriteMedication(ctx context.Context, input graph_models.FavoriteMedicationUpdateInput) (*models.FavoriteMedication, error) {
	var entity models.FavoriteMedication
	deepCopy.Copy(&input).To(&entity)

	if err := r.FavoriteMedicationRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteFavoriteMedication(ctx context.Context, id int) (bool, error) {
	if err := r.FavoriteMedicationRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) FavoriteMedications(ctx context.Context, page models.PaginationInput, filter *graph_models.FavoriteMedicationFilter, searchTerm *string) (*graph_models.FavoriteMedicationConnection, error) {
	var f models.FavoriteMedication
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	entities, count, err := r.FavoriteMedicationRepository.GetAll(page, &f, searchTerm)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.FavoriteMedicationEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.FavoriteMedicationEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.FavoriteMedicationConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) UserFavoriteMedications(ctx context.Context, page models.PaginationInput, searchTerm *string) (*graph_models.FavoriteMedicationConnection, error) {
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

	entities, count, err := r.FavoriteMedicationRepository.GetAll(page, &models.FavoriteMedication{UserID: user.ID}, searchTerm)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.FavoriteMedicationEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.FavoriteMedicationEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.FavoriteMedicationConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) SearchFavoriteMedications(ctx context.Context, searchTerm string, page models.PaginationInput) (*graph_models.FavoriteMedicationConnection, error) {
	entities, count, err := r.FavoriteMedicationRepository.Search(page, searchTerm)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.FavoriteMedicationEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.FavoriteMedicationEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.FavoriteMedicationConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
