package channel

import (
	"context"
	"log"

	"notification/internal/model"
)

type PushChannel struct{}

func (p *PushChannel) Name() string { return "push" }

func (p *PushChannel) Send(ctx context.Context, msg model.Message) error {
	log.Printf("[push] would push to user %s — subject: %q, template: %s", msg.UserID, msg.Subject, msg.Template)
	return nil
}
