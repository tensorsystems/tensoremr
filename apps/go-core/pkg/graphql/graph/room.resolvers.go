package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SaveRoom(ctx context.Context, input graph_models.RoomInput) (*models.Room, error) {
	gc, err := middleware.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	email := gc.GetString("email")
	if len(email) == 0 {
		return nil, errors.New("Cannot find user")
	}

	ok, err := r.AccessControl.Enforce(email, "rooms", "write")
	if !ok {
		return nil, errors.New("You are not authorized to perform this action")
	}

	var room models.Room
	deepCopy.Copy(&input).To(&room)

	if err := r.RoomRepository.Save(&room); err != nil {
		return nil, err
	}

	return &room, nil
}

func (r *mutationResolver) UpdateRoom(ctx context.Context, input graph_models.RoomInput, id int) (*models.Room, error) {
	gc, err := middleware.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	email := gc.GetString("email")
	if len(email) == 0 {
		return nil, errors.New("Cannot find user")
	}

	ok, err := r.AccessControl.Enforce(email, "rooms", "write")
	if !ok {
		return nil, errors.New("You are not authorized to perform this action")
	}

	var room models.Room
	deepCopy.Copy(&input).To(&room)

	if err := r.RoomRepository.Update(&room); err != nil {
		return nil, err
	}

	return &room, nil
}

func (r *mutationResolver) DeleteRoom(ctx context.Context, id int) (bool, error) {
	gc, err := middleware.GinContextFromContext(ctx)
	if err != nil {
		return false, err
	}

	email := gc.GetString("email")
	if len(email) == 0 {
		return false, errors.New("Cannot find user")
	}

	ok, err := r.AccessControl.Enforce(email, "rooms", "write")
	if !ok {
		return false, errors.New("You are not authorized to perform this action")
	}

	if err := r.RoomRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) Rooms(ctx context.Context, page models.PaginationInput) (*graph_models.RoomConnection, error) {
	rooms, count, err := r.RoomRepository.GetAll(page)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.RoomEdge, len(rooms))

	for i, entity := range rooms {
		e := entity

		edges[i] = &graph_models.RoomEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(rooms, count, page)
	return &graph_models.RoomConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
