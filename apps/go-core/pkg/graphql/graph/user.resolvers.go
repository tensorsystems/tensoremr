package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"

	graph_models "github.com/tensorsystems/tensoremr/apps/go-core/pkg/graphql/graph/model"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/jwt"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/middleware"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	deepCopy "github.com/ulule/deepcopier"
)

func (r *mutationResolver) Signup(ctx context.Context, input graph_models.UserInput) (*models.User, error) {
	var entity models.User
	deepCopy.Copy(&input).To(&entity)

	entity.Active = true

	if err := entity.HashPassword(); err != nil {
		return nil, err
	}

	if input.Signature != nil {
		fileName, hashedFileName, hash, ext := HashFileName(input.Signature.Name)
		err := WriteFile(input.Signature.File.File, hashedFileName+"."+ext)
		if err != nil {
			return nil, err
		}

		entity.Signature = &models.File{
			ContentType: input.Signature.File.ContentType,
			Size:        input.Signature.File.Size,
			FileName:    fileName,
			Extension:   ext,
			Hash:        hash,
		}
	}

	if input.ProfilePic != nil {
		fileName, hashedFileName, hash, ext := HashFileName(input.ProfilePic.Name)
		err := WriteFile(input.ProfilePic.File.File, hashedFileName+"."+ext)
		if err != nil {
			return nil, err
		}

		entity.ProfilePic = &models.File{
			ContentType: input.ProfilePic.File.ContentType,
			Size:        input.ProfilePic.File.Size,
			FileName:    fileName,
			Extension:   ext,
			Hash:        hash,
		}
	}

	userTypes, err := r.UserTypeRepository.GetByIds(input.UserTypeIds)
	if err != nil {
		return nil, err
	}

	if err := r.UserRepository.Save(&entity, userTypes); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) Login(ctx context.Context, input graph_models.LoginInput) (string, error) {
	var user models.User

	// Check if user exists
	if err := r.UserRepository.GetByEmail(&user, input.Email); err != nil {
		return "", err
	}

	// Check password validity
	pErr := user.CheckPassword(user.Password, input.Password)
	if pErr != nil {
		return "", pErr
	}

	// Generate JWT Token
	jwtWrapper := jwt.Wrapper{
		SecretKey:       r.Config.JwtSecret,
		Issuer:          r.Config.JwtIssuer,
		ExpirationHours: 24,
	}

	token, err := jwtWrapper.GenerateToken(user)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (r *mutationResolver) ResetPassword(ctx context.Context, id int) (*models.User, error) {
	var entity models.User
	if err := r.UserRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	entity.Password = "changeme"

	if err := entity.HashPassword(); err != nil {
		return nil, err
	}

	if err := r.UserRepository.Update(&entity, nil); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateUser(ctx context.Context, input graph_models.UserUpdateInput) (*models.User, error) {
	var entity models.User
	deepCopy.Copy(&input).To(&entity)

	if input.Signature != nil {
		fileName, hashedFileName, hash, ext := HashFileName(input.Signature.Name)
		err := WriteFile(input.Signature.File.File, hashedFileName+"."+ext)
		if err != nil {
			return nil, err
		}

		entity.Signature = &models.File{
			ContentType: input.Signature.File.ContentType,
			Size:        input.Signature.File.Size,
			FileName:    fileName,
			Extension:   ext,
			Hash:        hash,
		}
	}

	if input.ProfilePic != nil {
		fileName, hashedFileName, hash, ext := HashFileName(input.ProfilePic.Name)
		err := WriteFile(input.ProfilePic.File.File, hashedFileName+"."+ext)
		if err != nil {
			return nil, err
		}

		entity.ProfilePic = &models.File{
			ContentType: input.ProfilePic.File.ContentType,
			Size:        input.ProfilePic.File.Size,
			FileName:    fileName,
			Extension:   ext,
			Hash:        hash,
		}
	}

	userTypes, err := r.UserTypeRepository.GetByIds(input.UserTypeIds)
	if err != nil {
		return nil, err
	}

	if err := r.UserRepository.Update(&entity, userTypes); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) ChangePassword(ctx context.Context, input graph_models.ChangePasswordInput) (*models.User, error) {
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

	// Check password validity
	if user.CheckPassword(user.Password, input.PreviousPassword) != nil {
		return nil, err
	}

	// Check password confirmation
	if input.Password != input.ConfirmPassword {
		return nil, errors.New("Passwords do no match")
	}

	user.Password = input.Password
	if user.HashPassword() != nil {
		return nil, err
	}

	if err := r.UserRepository.Update(&user, nil); err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *mutationResolver) SaveUserType(ctx context.Context, input graph_models.UserTypeInput) (*models.UserType, error) {
	var entity models.UserType
	deepCopy.Copy(&input).To(&entity)

	if err := r.UserTypeRepository.Save(&entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mutationResolver) UpdateUserType(ctx context.Context, input graph_models.UserTypeUpdateInput) (*models.UserType, error) {
	var userType models.UserType
	deepCopy.Copy(&input).To(&userType)

	if err := r.UserTypeRepository.Update(&userType); err != nil {
		return nil, err
	}

	return &userType, nil
}

func (r *mutationResolver) DeleteUserType(ctx context.Context, id int) (bool, error) {
	if err := r.UserTypeRepository.Delete(id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) User(ctx context.Context, id int) (*models.User, error) {
	var entity models.User

	if err := r.UserRepository.Get(&entity, id); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *queryResolver) Users(ctx context.Context, page models.PaginationInput, filter *graph_models.UserFilter, searchTerm *string) (*graph_models.UserConnection, error) {
	var f models.User
	if filter != nil {
		deepCopy.Copy(filter).To(&f)
	}

	entities, count, err := r.UserRepository.Search(page, &f, searchTerm)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.UserEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.UserEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.UserConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) UserTypes(ctx context.Context, page models.PaginationInput) (*graph_models.UserTypeConnection, error) {
	entities, count, err := r.UserTypeRepository.GetAll(page)

	if err != nil {
		return nil, err
	}

	edges := make([]*graph_models.UserTypeEdge, len(entities))

	for i, entity := range entities {
		e := entity

		edges[i] = &graph_models.UserTypeEdge{
			Node: &e,
		}
	}

	pageInfo, totalCount := GetPageInfo(entities, count, page)
	return &graph_models.UserTypeConnection{PageInfo: pageInfo, Edges: edges, TotalCount: totalCount}, nil
}

func (r *queryResolver) SearchUsers(ctx context.Context, input graph_models.UserSearchInput) ([]*models.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) GetByUserTypeTitle(ctx context.Context, input string) ([]*models.User, error) {
	users, err := r.UserRepository.GetByUserTypeTitle(input)
	if err != nil {
		return nil, err
	}

	return users, nil
}
