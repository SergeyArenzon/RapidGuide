package channel

import (
	"context"
	"log"

	"notification/internal/model"
)

type SMSChannel struct{}

func (s *SMSChannel) Name() string { return "sms" }

func (s *SMSChannel) Send(ctx context.Context, msg model.Message) error {
	log.Printf("[sms] would send to user %s — subject: %q, template: %s", msg.UserID, msg.Subject, msg.Template)
	return nil
}
