package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	graph_models "github.com/tensorsystems/tensoremr/apps/server/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) SaveFile(ctx context.Context, input graph_models.FileInput) (*models.File, error) {
	var entity models.File
	deepCopy.Copy(&input).To(&entity)

	if err := r.FileRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateFile(ctx context.Context, input graph_models.FileUpdateInput) (*models.File, error) {
	var entity models.File
	if err := r.FileRepository.Get(&entity, input.ID); err != nil {
		return nil, err
	}

	// Rename file
	fileName, hashedFileName, hash, ext := HashFileName(input.FileName + "." + entity.Extension)
	originaName := entity.FileName + "_" + entity.Hash + "." + entity.Extension
	newFileName := hashedFileName + "." + ext

	if err := RenameFile(originaName, newFileName); err != nil {
		return nil, err
	}

	// Update file entity
	entity.FileName = fileName
	entity.Hash = hash
	if err := r.FileRepository.Update(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) DeleteFile(ctx context.Context, id int) (bool, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) File(ctx context.Context, id int) (*models.File, error) {
	var entity models.File

	if err := r.FileRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) Files(ctx context.Context, page models.PaginationInput) (*graph_models.FileConnection, error) {
	panic(fmt.Errorf("not implemented"))
}
