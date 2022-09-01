package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
)

func (r *queryResolver) Notifs(ctx context.Context) (*graph_models.Notif, error) {
	diagnostics := r.DiagnosticProcedureOrderRepository.GetTodaysOrderedCount()
	surgical := r.SurgicalOrderRepository.GetTodaysOrderedCount()
	labs := r.LabOrderRepository.GetTodaysOrderedCount()
	treatments := r.TreatmentOrderRepository.GetTodaysOrderedCount()
	followUps := r.FollowUpOrderRepository.GetTodaysOrderedCount()
	referrals := r.ReferralOrderRepository.GetTodaysOrderedCount()
	waivers, err := r.PaymentWaiverRepository.GetApprovedCount()

	if err != nil {
		return nil, err
	}

	return &graph_models.Notif{
		DiagnosticProcedureOrders: diagnostics,
		LabOrders:                 labs,
		TreatmentOrders:           treatments,
		SurgicalOrders:            surgical,
		ReferralOrders:            referrals,
		FollowUpOrders:            followUps,
		PaymentWaivers:            waivers,
	}, nil
}
