package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"

	"github.com/tensorsystems/tensoremr/apps/server/pkg/graphql/graph/generated"
	graph_models "github.com/tensorsystems/tensoremr/apps/server/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SavePayment(ctx context.Context, input graph_models.PaymentInput) (*models.Payment, error) {
	var entity models.Payment
	deepCopy.Copy(&input).To(&entity)

	if err := r.PaymentRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdatePayment(ctx context.Context, input graph_models.PaymentInput) (*models.Payment, error) {
	var entity models.Payment
	deepCopy.Copy(&input).To(&entity)

	if err := r.PaymentRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeletePayment(ctx context.Context, id int) (bool, error) {
	if err := r.PaymentRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) ConfirmPayment(ctx context.Context, id int, invoiceNo string) (*models.Payment, error) {
	var entity models.Payment
	entity.ID = id
	entity.Status = models.PaidPaymentStatus
	entity.InvoiceNo = invoiceNo

	if err := r.PaymentRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) ConfirmPayments(ctx context.Context, ids []int, invoiceNo string) (bool, error) {
	if err := r.PaymentRepository.BatchUpdate(ids, models.Payment{Status: models.PaidPaymentStatus, InvoiceNo: invoiceNo}); err != nil {
		return false, err
	}
	return true, nil
}

func (r *mutationResolver) RequestPaymentWaiver(ctx context.Context, paymentID int, patientID int) (*models.Payment, error) {
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

	var entity models.Payment

	if err := r.PaymentRepository.RequestWaiver(&entity, paymentID, patientID, user.ID); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) RequestPaymentWaivers(ctx context.Context, ids []int, patientID int) (bool, error) {
	gc, err := middleware.GinContextFromContext(ctx)
	if err != nil {
		return false, err
	}

	email := gc.GetString("email")
	if len(email) == 0 {
		return false, errors.New("Cannot find user")
	}

	var user models.User
	if err := r.UserRepository.GetByEmail(&user, email); err != nil {
		return false, err
	}

	if err := r.PaymentRepository.RequestWaiverBatch(ids, patientID, user.ID); err != nil {
		return false, err
	}

	return true, nil
}

func (r *paymentResolver) Status(ctx context.Context, obj *models.Payment) (string, error) {
	return string(obj.Status), nil
}

func (r *queryResolver) Payments(ctx context.Context, page models.PaginationInput) (*graph_models.PaymentConnection, error) {
	panic(fmt.Errorf("not implemented"))
}

// Payment returns generated.PaymentResolver implementation.
func (r *Resolver) Payment() generated.PaymentResolver { return &paymentResolver{r} }

type paymentResolver struct{ *Resolver }
