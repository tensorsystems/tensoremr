package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SaveChiefComplaint(ctx context.Context, input graph_models.ChiefComplaintInput) (*models.ChiefComplaint, error) {
	var chiefComplaint models.ChiefComplaint
	deepCopy.Copy(&input).To(&chiefComplaint)

	hpiComponents, err := r.HpiComponentRepository.GetByIds(input.HpiComponentIds)
	if err != nil {
		return nil, err
	}

	chiefComplaint.HPIComponents = hpiComponents

	if err := r.ChiefComplaintRepository.Save(&chiefComplaint); err != nil {
		return nil, err
	}

	return &chiefComplaint, nil
}

func (r *mutationResolver) UpdateChiefComplaint(ctx context.Context, input graph_models.ChiefComplaintUpdateInput) (*models.ChiefComplaint, error) {
	var chiefComplaint models.ChiefComplaint
	deepCopy.Copy(&input).To(&chiefComplaint)

	hpiComponents, err := r.HpiComponentRepository.GetByIds(input.HpiComponentIds)
	if err != nil {
		return nil, err
	}

	chiefComplaint.HPIComponents = hpiComponents

	if err := r.ChiefComplaintRepository.Update(&chiefComplaint); err != nil {
		return nil, err
	}

	if err := r.ChiefComplaintRepository.Get(&chiefComplaint, chiefComplaint.ID); err != nil {
		return nil, err
	}

	return &chiefComplaint, nil
}

func (r *mutationResolver) DeleteChiefComplaint(ctx context.Context, id int) (bool, error) {
	if err := r.ChiefComplaintRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) SavePatientChiefComplaint(ctx context.Context, input graph_models.ChiefComplaintInput) (*models.ChiefComplaint, error) {
	var patientChart models.PatientChart
	if err := r.PatientChartRepository.Get(&patientChart, input.PatientChartID); err != nil {
		return nil, err
	}

	var chiefComplaint models.ChiefComplaint
	chiefComplaint.Title = input.Title
	chiefComplaint.PatientChartID = input.PatientChartID

	if err := r.ChiefComplaintRepository.Save(&chiefComplaint); err != nil {
		return nil, err
	}

	return &chiefComplaint, nil
}

func (r *mutationResolver) DeletePatientChiefComplaint(ctx context.Context, id int) (bool, error) {
	if err := r.ChiefComplaintRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) ChiefComplaints(ctx context.Context, page models.PaginationInput, filter *graph_models.ChiefComplaintFilter) (*graph_models.ChiefComplaintConnection, error) {
	var f models.ChiefComplaint
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	chiefComplaints, count, err := r.ChiefComplaintRepository.GetAll(page, &f)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ChiefComplaintEdge, len(chiefComplaints))

	for i, entity := range chiefComplaints {
		e := entity

		edges[i] = &graph_models.ChiefComplaintEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(chiefComplaints, count, page)
	return &graph_models.ChiefComplaintConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) SearchChiefComplaints(ctx context.Context, searchTerm string, page models.PaginationInput) (*graph_models.ChiefComplaintConnection, error) {
	chiefComplaints, count, err := r.ChiefComplaintRepository.Search(page, searchTerm)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ChiefComplaintEdge, len(chiefComplaints))

	for i, entity := range chiefComplaints {
		e := entity

		edges[i] = &graph_models.ChiefComplaintEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(chiefComplaints, count, page)
	return &graph_models.ChiefComplaintConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}
