package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"notification/internal/channel"
	"notification/internal/model"
)

// Handler parses RabbitMQ messages and dispatches to registered channels.
type Handler struct {
	channels map[string]channel.Channel
}

// New creates a Handler with the given channel registry.
func New(channels map[string]channel.Channel) *Handler {
	return &Handler{channels: channels}
}

// Handle is the rabbitmq.Handler callback. It parses the JSON body
// and sends to each requested channel.
func (handler *Handler) Handle(ctx context.Context, body []byte) error {
	var msg model.Message
	if err := json.Unmarshal(body, &msg); err != nil {
		return fmt.Errorf("invalid message JSON: %w", err)
	}

	log.Printf("[handler] notification for user %s via %v", msg.UserID, msg.Channels)

	for _, name := range msg.Channels {
		channel, ok := handler.channels[name]
		if !ok {
			log.Printf("[handler] unknown channel %q, skipping", name)
			continue
		}
		if err := channel.Send(ctx, msg); err != nil {
			log.Printf("[handler] %s send error: %v", name, err)
		}
	}

	return nil
}
