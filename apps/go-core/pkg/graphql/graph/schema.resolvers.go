package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/generated"
	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
)

func (r *mutationResolver) CreateTodo(ctx context.Context, input graph_models.NewTodo) (*graph_models.Todo, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Todos(ctx context.Context) ([]*graph_models.Todo, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) GetHealthCheck(ctx context.Context) (*graph_models.HealthCheckReport, error) {
	pingErr := r.UserRepository.Ping()
	if pingErr != nil {
		return &graph_models.HealthCheckReport{
			Health: "NOT",
			Db:     false,
		}, pingErr
	}

	return &graph_models.HealthCheckReport{Health: "YES", Db: true}, nil
}

func (r *queryResolver) ReceptionHomeStats(ctx context.Context) (*graph_models.HomeStats, error) {
	scheduled, checkedIn, checkedOut, err := r.AppointmentRepository.ReceptionHomeStats()

	return &graph_models.HomeStats{
		Scheduled:  scheduled,
		CheckedIn:  checkedIn,
		CheckedOut: checkedOut,
	}, err
}

func (r *queryResolver) NurseHomeStats(ctx context.Context) (*graph_models.HomeStats, error) {
	scheduled, checkedIn, checkedOut, err := r.AppointmentRepository.NurseHomeStats()

	return &graph_models.HomeStats{
		Scheduled:  scheduled,
		CheckedIn:  checkedIn,
		CheckedOut: checkedOut,
	}, err
}

func (r *queryResolver) PhysicianHomeStats(ctx context.Context) (*graph_models.HomeStats, error) {
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

	scheduled, checkedIn, checkedOut, err := r.AppointmentRepository.PhysicianHomeStats(user.ID)

	return &graph_models.HomeStats{
		Scheduled:  scheduled,
		CheckedIn:  checkedIn,
		CheckedOut: checkedOut,
	}, err
}

func (r *queryResolver) CurrentDateTime(ctx context.Context) (*time.Time, error) {
	currentTime := time.Now()
	return &currentTime, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
