package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
)

func (r *queryResolver) HistoryOfDisorders(ctx context.Context, size *int, searchTerm *string) ([]*graph_models.SnomedCt, error) {
	var s int
	var search string

	if size != nil {
		s = *size
	} else {
		s = 20
	}

	if searchTerm != nil {
		search = *searchTerm
	} else {
		search = " "
	}

	resp, err := r.TerminologyService.GetHistoryOfDisorders(int64(s), search)
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.SnomedCt, len(resp.Items))

	for i, entity := range resp.Items {
		e := entity
		edges[i] = &graph_models.SnomedCt{
			Sctid:              e.Sctid,
			CaseSignificanceID: e.CaseSignificanceId,
			Nodetype:           e.Nodetype,
			AcceptabilityID:    e.AcceptabilityId,
			RefsetID:           e.RefsetId,
			LanguageCode:       e.LanguageCode,
			DescriptionType:    e.DescriptionType,
			Term:               e.Term,
			TypeID:             e.TypeId,
			ModuleID:           e.ModuleId,
		}
	}

	return edges, nil
}
