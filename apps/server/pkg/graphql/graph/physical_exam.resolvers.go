package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/server/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SaveExamCategory(ctx context.Context, input graph_models.ExamCategoryInput) (*models.ExamCategory, error) {
	var entity models.ExamCategory
	deepCopy.Copy(&input).To(&entity)

	if err := r.ExamCategoryRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateExamCategory(ctx context.Context, input graph_models.ExamCategoryUpdateInput) (*models.ExamCategory, error) {
	var entity models.ExamCategory
	deepCopy.Copy(&input).To(&entity)

	if err := r.ExamCategoryRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) SaveExamFinding(ctx context.Context, input graph_models.ExamFindingInput) (*models.ExamFinding, error) {
	var entity models.ExamFinding
	deepCopy.Copy(&input).To(&entity)

	if err := r.ExamFindingRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateExamFinding(ctx context.Context, input graph_models.ExamFindingUpdateInput) (*models.ExamFinding, error) {
	var entity models.ExamFinding
	deepCopy.Copy(&input).To(&entity)

	if err := r.ExamFindingRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) SavePhysicalExamFinding(ctx context.Context, input graph_models.PhysicalExamFindingInput) (*models.PhysicalExamFinding, error) {
	var entity models.PhysicalExamFinding
	deepCopy.Copy(&input).To(&entity)

	if err := r.PhysicalExamFindingRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdatePhysicalExamFinding(ctx context.Context, input graph_models.PhysicalExamFindingUpdateInput) (*models.PhysicalExamFinding, error) {
	var entity models.PhysicalExamFinding
	deepCopy.Copy(&input).To(&entity)

	if input.Abnormal != nil {
		entity.Abnormal = *input.Abnormal
	}

	if err := r.PhysicalExamFindingRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeletePhysicalExamFinding(ctx context.Context, id int) (bool, error) {
	if err := r.PhysicalExamFindingRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeletePhysicalExamFindingExamCategory(ctx context.Context, physicalExamFindingID int, examCategoryID int) (*models.PhysicalExamFinding, error) {
	var entity models.PhysicalExamFinding

	if err := r.PhysicalExamFindingRepository.DeleteExamCategory(&entity, physicalExamFindingID, examCategoryID); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) ExamCategory(ctx context.Context, id int) (*models.ExamCategory, error) {
	var entity models.ExamCategory

	if err := r.ExamCategoryRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) ExamCategories(ctx context.Context, page models.PaginationInput, searchTerm *string) (*graph_models.ExamCategoryConnection, error) {
	entities, count, err := r.ExamCategoryRepository.GetAll(page, searchTerm)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ExamCategoryEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.ExamCategoryEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.ExamCategoryConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) ExamFinding(ctx context.Context, id int) (*models.ExamFinding, error) {
	var entity models.ExamFinding

	if err := r.ExamFindingRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) ExamFindings(ctx context.Context, page models.PaginationInput, searchTerm *string) (*graph_models.ExamFindingConnection, error) {
	entities, count, err := r.ExamFindingRepository.GetAll(page, searchTerm)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ExamFindingEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.ExamFindingEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.ExamFindingConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) PhysicalExamFinding(ctx context.Context, id int) (*models.PhysicalExamFinding, error) {
	var entity models.PhysicalExamFinding

	if err := r.PhysicalExamFindingRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) PhysicalExamFindings(ctx context.Context, page models.PaginationInput, filter *graph_models.PhysicalExamFindingFilter) (*graph_models.PhysicalExamFindingConnection, error) {
	var f models.PhysicalExamFinding
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	entities, count, err := r.PhysicalExamFindingRepository.GetAll(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.PhysicalExamFindingEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.PhysicalExamFindingEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.PhysicalExamFindingConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
