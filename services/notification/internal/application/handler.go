package application

import (
	"context"
	"log"

	"notification/internal/domain"
)

// Handler processes notification events (route + dispatch).
type Handler struct{}

// NewHandler returns a new application handler.
func NewHandler() *Handler {
	return &Handler{}
}

// HandleNotification processes a notification event: for now it logs and
// will later route to channels and dispatch.
func (h *Handler) HandleNotification(ctx context.Context, e *domain.NotificationEvent) error {
	log.Printf("[notification] event: source=%q type=%q user=%q template=%q",
		e.Source, e.Type, e.UserID, e.Template)

	// TODO: route event -> Notification(s), respect preferences, then dispatch per channel
	_ = e
	return nil
}
