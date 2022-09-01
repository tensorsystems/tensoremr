package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"

	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
)

func (r *mutationResolver) SaveFavoriteDiagnosis(ctx context.Context, diagnosisID int) (*models.FavoriteDiagnosis, error) {
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

	var entity models.FavoriteDiagnosis
	entity.DiagnosisID = diagnosisID
	entity.UserID = user.ID

	if err := r.FavoriteDiagnosisRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, err
}

func (r *mutationResolver) DeleteFavoriteDiagnosis(ctx context.Context, id int) (*int, error) {
	if err := r.FavoriteDiagnosisRepository.Delete(id); err != nil {
		return nil, err
	}

	return &id, nil
}

func (r *queryResolver) FavoriteDiagnosis(ctx context.Context) ([]*models.FavoriteDiagnosis, error) {
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

	entities, err := r.FavoriteDiagnosisRepository.GetByUser(user.ID)

	if err != nil {
		return nil, err
	}

	return entities, nil
}
