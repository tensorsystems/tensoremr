package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
)

func (r *queryResolver) HistoryOfDisorderConcepts(ctx context.Context, size *int, searchTerm *string, pertinence *graph_models.Pertinence) ([]*graph_models.ConceptDescription, error) {
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

	edges := make([]*graph_models.ConceptDescription, len(resp.Items))

	for i, entity := range resp.Items {
		e := entity
		edges[i] = &graph_models.ConceptDescription{
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

func (r *queryResolver) FamilyIllnessConcepts(ctx context.Context, size *int, searchTerm *string, pertinence *graph_models.Pertinence) ([]*graph_models.ConceptDescription, error) {
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

	edges := make([]*graph_models.ConceptDescription, len(resp.Items))

	for i, entity := range resp.Items {
		e := entity
		edges[i] = &graph_models.ConceptDescription{
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

func (r *queryResolver) ProcedureConcepts(ctx context.Context, size *int, searchTerm *string, pertinence *graph_models.Pertinence) ([]*graph_models.ConceptDescription, error) {
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

	resp, err := r.TerminologyService.SearchProcedures(int64(s), fullSearchTerm)
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ConceptDescription, len(resp.Items))

	for i, entity := range resp.Items {
		e := entity
		edges[i] = &graph_models.ConceptDescription{
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

func (r *queryResolver) SocialHistoryConcepts(ctx context.Context, size *int, searchTerm *string) ([]*graph_models.ConceptDescription, error) {
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

	resp, err := r.TerminologyService.SearchSocialHistory(int64(s), fullSearchTerm)
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ConceptDescription, len(resp.Items))

	for i, entity := range resp.Items {
		e := entity
		edges[i] = &graph_models.ConceptDescription{
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

func (r *queryResolver) LifestyleConcepts(ctx context.Context, size *int, searchTerm *string) ([]*graph_models.ConceptDescription, error) {
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

	resp, err := r.TerminologyService.SearchLifestyle(int64(s), fullSearchTerm)
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ConceptDescription, len(resp.Items))

	for i, entity := range resp.Items {
		e := entity
		edges[i] = &graph_models.ConceptDescription{
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

func (r *queryResolver) AdministrativeStatusConcepts(ctx context.Context, size *int, searchTerm *string) ([]*graph_models.ConceptDescription, error) {
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

	resp, err := r.TerminologyService.SearchAdministrativeStatus(int64(s), fullSearchTerm)
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ConceptDescription, len(resp.Items))

	for i, entity := range resp.Items {
		e := entity
		edges[i] = &graph_models.ConceptDescription{
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

func (r *queryResolver) ConceptChildren(ctx context.Context, conceptID string) ([]*graph_models.ConceptChild, error) {
	resp, err := r.TerminologyService.GetConceptChildren(conceptID)
	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.ConceptChild, len(resp.Children))

	for i, entity := range resp.Children {
		e := entity

		edges[i] = &graph_models.ConceptChild{
			Concept: &graph_models.Concept{
				Sctid: e.Child.Sctid,
				Fsn:   e.Child.FSN,
			},
			Description: &graph_models.ConceptDescription{
				Sctid:              e.Description.Sctid,
				CaseSignificanceID: e.Description.CaseSignificanceId,
				Nodetype:           e.Description.Nodetype,
				AcceptabilityID:    e.Description.AcceptabilityId,
				RefsetID:           e.Description.RefsetId,
				LanguageCode:       e.Description.LanguageCode,
				DescriptionType:    e.Description.DescriptionType,
				Term:               e.Description.Term,
				TypeID:             e.Description.TypeId,
				ModuleID:           e.Description.ModuleId,
			},
			ChildrenCount: int(e.Count),
		}
	}

	return edges, nil
}
