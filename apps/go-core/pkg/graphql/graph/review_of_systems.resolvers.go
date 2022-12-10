package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SaveSystem(ctx context.Context, input graph_models.SystemInput) (*models.System, error) {
	var entity models.System
	deepCopy.Copy(&input).To(&entity)

	if err := r.SystemRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateSystem(ctx context.Context, input graph_models.SystemUpdateInput) (*models.System, error) {
	var entity models.System
	deepCopy.Copy(&input).To(&entity)

	if err := r.SystemRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) SaveSystemSymptom(ctx context.Context, input graph_models.SystemSymptomInput) (*models.SystemSymptom, error) {
	var entity models.SystemSymptom
	deepCopy.Copy(&input).To(&entity)

	if err := r.SystemSymptomRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateSystemSymptom(ctx context.Context, input graph_models.SystemSymptomUpdateInput) (*models.SystemSymptom, error) {
	var entity models.SystemSymptom
	deepCopy.Copy(&input).To(&entity)

	if err := r.SystemSymptomRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) SaveReviewOfSystem(ctx context.Context, input graph_models.ReviewOfSystemInput) (*models.ReviewOfSystem, error) {
	var entity models.ReviewOfSystem
	deepCopy.Copy(&input).To(&entity)

	if err := r.ReviewOfSystemRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateReviewOfSystem(ctx context.Context, input graph_models.ReviewOfSystemUpdateInput) (*models.ReviewOfSystem, error) {
	var entity models.ReviewOfSystem
	deepCopy.Copy(&input).To(&entity)

	if err := r.ReviewOfSystemRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteReviewOfSystem(ctx context.Context, id int) (bool, error) {
	if err := r.ReviewOfSystemRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) System(ctx context.Context, id int) (*models.System, error) {
	var entity models.System

	if err := r.SystemRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) Systems(ctx context.Context, page models.PaginationInput, searchTerm *string) (*graph_models.SystemConnection, error) {
	entities, count, err := r.SystemRepository.GetAll(page, searchTerm)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.SystemEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.SystemEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.SystemConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) SystemSymptom(ctx context.Context, id int) (*models.SystemSymptom, error) {
	var entity models.SystemSymptom

	if err := r.SystemSymptomRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) SystemSymptoms(ctx context.Context, page models.PaginationInput, searchTerm *string) (*graph_models.SystemSymptomConnection, error) {
	entities, count, err := r.SystemSymptomRepository.GetAll(page, searchTerm)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.SystemSymptomEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.SystemSymptomEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.SystemSymptomConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) ReviewOfSystem(ctx context.Context, id int) (*models.ReviewOfSystem, error) {
	var entity models.ReviewOfSystem

	if err := r.ReviewOfSystemRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) ReviewOfSystems(ctx context.Context, page models.PaginationInput, filter *graph_models.ReviewOfSystemFilter) (*graph_models.ReviewOfSystemConnection, error) {
	var f models.ReviewOfSystem
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	entities, count, err := r.ReviewOfSystemRepository.GetAll(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ReviewOfSystemEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.ReviewOfSystemEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.ReviewOfSystemConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
