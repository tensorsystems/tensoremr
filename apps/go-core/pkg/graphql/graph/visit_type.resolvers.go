package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SaveVisitType(ctx context.Context, input graph_models.VisitTypeInput) (*models.VisitType, error) {
	var visitType models.VisitType
	deepCopy.Copy(&input).To(&visitType)

	if err := r.VisitTypeRepository.Save(&visitType); err != nil {
		return nil, err
	}

	return &visitType, nil
}

func (r *mutationResolver) UpdateVisitType(ctx context.Context, input graph_models.VisitTypeInput, id int) (*models.VisitType, error) {
	var visitType models.VisitType
	deepCopy.Copy(&input).To(&visitType)

	visitType.ID = id

	if err := r.VisitTypeRepository.Update(&visitType); err != nil {
		return nil, err
	}

	return &visitType, nil
}

func (r *mutationResolver) DeleteVisitType(ctx context.Context, id int) (bool, error) {
	if err := r.VisitTypeRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) VisitTypes(ctx context.Context, page models.PaginationInput) (*graph_models.VisitTypeConnection, error) {
	visitTypes, count, err := r.VisitTypeRepository.GetAll(page)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.VisitTypeEdge, len(visitTypes))

	for i, entity := range visitTypes {
		e := entity

		edges[i] = &graph_models.VisitTypeEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(visitTypes, count, page)
	return &graph_models.VisitTypeConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
