package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SaveOrganizationDetails(ctx context.Context, input graph_models.OrganizationDetailsInput) (*models.OrganizationDetails, error) {
	var entity models.OrganizationDetails
	deepCopy.Copy(&input).To(&entity)

	if input.Logo != nil {
		fileName, hashedFileName, hash, ext := HashFileName(input.Logo.Name)
		err := WriteFile(input.Logo.File.File, hashedFileName+"."+ext)
		if err != nil {
			return nil, err
		}

		entity.Logo = &models.File{
			ContentType: input.Logo.File.ContentType,
			Size:        input.Logo.File.Size,
			FileName:    fileName,
			Extension:   ext,
			Hash:        hash,
		}
	}

	var existing models.OrganizationDetails
	if err := r.OrganizationDetailsRepository.Get(&existing); err == nil {
		entity.ID = existing.ID

		if err := r.OrganizationDetailsRepository.Update(&entity); err != nil {
			return nil, err
		}
	} else {
		if err := r.OrganizationDetailsRepository.Save(&entity); err != nil {
			return nil, err
		}
	}

	return &entity, nil
}

func (r *queryResolver) OrganizationDetails(ctx context.Context) (*models.OrganizationDetails, error) {
	var entity models.OrganizationDetails

	if err := r.OrganizationDetailsRepository.Get(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}
