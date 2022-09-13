package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
)

func (r *queryResolver) HistoryOfDisorderConcepts(ctx context.Context, size *int, searchTerm *string, pertinence *graph_models.Pertinence) ([]*graph_models.Concept, error) {
	var s int

	if size != nil {
		s = *size
	} else {
		s = 20
	}

	var term string
	if searchTerm != nil {
		term = *searchTerm
	} else {
		term = " "
	}

	fullSearchTerm := term

	resp, err := r.TerminologyService.SearchHistoryOfDisorders(int64(s), fullSearchTerm)
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.Concept, len(resp.Items))

	for i, entity := range resp.Items {
		e := entity
		edges[i] = &graph_models.Concept{
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

func (r *queryResolver) FamilyIllnessConcepts(ctx context.Context, size *int, searchTerm *string, pertinence *graph_models.Pertinence) ([]*graph_models.Concept, error) {
	var s int

	if size != nil {
		s = *size
	} else {
		s = 20
	}

	var term string
	if searchTerm != nil {
		term = *searchTerm
	} else {
		term = " "
	}

	fullSearchTerm := term

	resp, err := r.TerminologyService.SearchFamilyHistory(int64(s), fullSearchTerm)
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.Concept, len(resp.Items))

	for i, entity := range resp.Items {
		e := entity
		edges[i] = &graph_models.Concept{
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

func (r *queryResolver) SurgicalProcedureConcepts(ctx context.Context, size *int, searchTerm *string, pertinence *graph_models.Pertinence) ([]*graph_models.Concept, error) {
	var s int

	if size != nil {
		s = *size
	} else {
		s = 20
	}

	var term string
	if searchTerm != nil {
		term = *searchTerm
	} else {
		term = " "
	}

	fullSearchTerm := term

	resp, err := r.TerminologyService.SearchSurgicalProcedures(int64(s), fullSearchTerm)
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.Concept, len(resp.Items))

	for i, entity := range resp.Items {
		e := entity
		edges[i] = &graph_models.Concept{
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

func (r *queryResolver) ConceptAttributes(ctx context.Context, conceptID string) (*graph_models.ConceptAttributes, error) {
	resp, err := r.TerminologyService.GetConceptAttributes(conceptID)
	if err != nil {
		return nil, err
	}

	var conceptAttribute graph_models.ConceptAttributes
	for _, e := range resp.Attributes {
		if e.RelationshipTypeId == "408732007" {
			conceptAttribute.SubjectRelationshipContext = &e.Association.Sctid
		}

		if e.RelationshipTypeId == "408729009" {
			conceptAttribute.FindingContext = &e.Association.Sctid
		}

		if e.RelationshipTypeId == "408731000" {
			conceptAttribute.TemporalContext = &e.Association.Sctid
		}

		if e.RelationshipTypeId == "246090004" {
			conceptAttribute.AssociatedFinding = &e.Association.Sctid
		}
	}

	return &conceptAttribute, nil
}
