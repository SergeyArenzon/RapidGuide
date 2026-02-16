package channel

import (
	"context"
	"log"

	"notification/internal/model"
)

type EmailChannel struct{}

func (e *EmailChannel) Name() string { return "email" }

func (e *EmailChannel) Send(ctx context.Context, msg model.Message) error {
	log.Printf("[email] would send to user %s — subject: %q, template: %s", msg.UserID, msg.Subject, msg.Template)
	return nil
}
