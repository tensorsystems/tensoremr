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
)

func (r *mutationResolver) CreateChat(ctx context.Context, input graph_models.ChatInput) (*models.Chat, error) {
	// Get current user
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

	var recipient models.User
	if err := r.UserRepository.Get(&recipient, input.RecipientID); err != nil {
		return nil, err
	}

	chatID, err := r.ChatMemberRepository.FindCommonChatID(user.ID, recipient.ID)
	if err != nil {
		return nil, err
	}

	var chat models.Chat
	chat.RecentMessage = input.Message

	if chatID != 0 {
		if err := r.ChatRepository.Get(&chat, chatID); err != nil {
			return nil, err
		}
	} else {
		chat = models.Chat{
			RecentMessage: input.Message,
			ChatMembers: []models.ChatMember{
				{UserID: user.ID, DisplayName: user.FirstName + " " + user.LastName},
				{UserID: recipient.ID, DisplayName: recipient.FirstName + " " + recipient.LastName},
			},
		}
	}

	if err := r.ChatRepository.Save(&chat); err != nil {
		return nil, err
	}

	// Save message
	var chatMessage models.ChatMessage
	chatMessage.Body = input.Message
	chatMessage.ChatID = chat.ID
	chatMessage.UserID = user.ID
	if err := r.ChatMessageRepository.Save(&chatMessage); err != nil {
		return nil, err
	}

	// Save unread message
	var unreadMessage models.ChatUnreadMessage
	unreadMessage.ChatID = chat.ID
	unreadMessage.UserID = recipient.ID
	if err := r.ChatUnreadRepository.Save(&unreadMessage); err != nil {
		return nil, err
	}

	return &chat, nil
}

func (r *mutationResolver) SendMessage(ctx context.Context, input graph_models.ChatMessageInput) (*models.ChatMessage, error) {
	// Get current user
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

	// Save message
	var chatMessage models.ChatMessage
	chatMessage.Body = input.Body
	chatMessage.ChatID = input.ChatID
	chatMessage.UserID = user.ID
	if err := r.ChatMessageRepository.Save(&chatMessage); err != nil {
		return nil, err
	}

	// Update chat
	var chat models.Chat
	chat.ID = input.ChatID
	chat.RecentMessage = chatMessage.Body
	if err := r.ChatRepository.Update(&chat); err != nil {
		return nil, err
	}

	chatMembers, err := r.ChatMemberRepository.GetByChatID(input.ChatID)
	if err != nil {
		return nil, err
	}

	var recipient *models.ChatMember
	for _, member := range chatMembers {
		if member.UserID != user.ID {
			recipient = member
		}
	}

	// Save unread message
	var unreadMessage models.ChatUnreadMessage
	unreadMessage.ChatID = input.ChatID
	unreadMessage.UserID = recipient.UserID
	if err := r.ChatUnreadRepository.Save(&unreadMessage); err != nil {
		return nil, err
	}

	return &chatMessage, nil
}

func (r *mutationResolver) MuteChat(ctx context.Context, id int) (*models.ChatMute, error) {
	// Get current user
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

	var chatMute models.ChatMute
	chatMute.ChatID = id
	chatMute.UserID = user.ID
	if err := r.ChatMuteRepository.Save(&chatMute); err != nil {
		return nil, err
	}

	return &chatMute, nil
}

func (r *mutationResolver) UnmuteChat(ctx context.Context, id int) (bool, error) {
	// Get current user
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

	if err := r.ChatMuteRepository.Delete(user.ID, id); err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) DeleteChat(ctx context.Context, id int) (bool, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) DeleteUnreadMessages(ctx context.Context, userID int, chatID int) (bool, error) {
	if err := r.ChatUnreadRepository.DeleteForUserChat(userID, chatID); err != nil {
		return false, err
	}

	return true, nil
}

func (r *queryResolver) GetChat(ctx context.Context) (*models.Chat, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) GetUserChats(ctx context.Context) ([]*models.Chat, error) {
	// Get current user
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

	results, err := r.ChatRepository.GetUserChats(user.ID)
	if err != nil {
		return nil, err
	}

	return results, nil
}

func (r *queryResolver) GetChatMessages(ctx context.Context, id int) ([]*models.ChatMessage, error) {
	// Get current user
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

	results, err := r.ChatMessageRepository.GetByChatID(id)
	if err != nil {
		return nil, err
	}

	return results, nil
}

func (r *queryResolver) GetChatMembers(ctx context.Context, id int) ([]*models.ChatMember, error) {
	// Get current user
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

	results, err := r.ChatMemberRepository.GetByChatID(id)
	if err != nil {
		return nil, err
	}

	return results, nil
}

func (r *queryResolver) GetUnreadMessages(ctx context.Context) ([]*models.ChatUnreadMessage, error) {
	// Get current user
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

	results, err := r.ChatUnreadRepository.GetByUserID(user.ID)
	if err != nil {
		return nil, err
	}

	return results, nil
}

func (r *queryResolver) GetCommonChat(ctx context.Context, recipientID int) (*models.Chat, error) {
	// Get current user
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

	var recipient models.User
	if err := r.UserRepository.Get(&recipient, recipientID); err != nil {
		return nil, err
	}

	chatID, err := r.ChatMemberRepository.FindCommonChatID(user.ID, recipient.ID)
	if err != nil {
		return nil, err
	}

	var chat models.Chat
	if err := r.ChatRepository.Get(&chat, chatID); err != nil {
		return nil, err
	}

	return &chat, nil
}

func (r *subscriptionResolver) Notification(ctx context.Context) (<-chan *graph_models.Notification, error) {
	panic(fmt.Errorf("not implemented"))
}

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type subscriptionResolver struct{ *Resolver }
