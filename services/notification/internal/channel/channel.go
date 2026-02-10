package channel

import (
	"context"

	"notification/internal/model"
)

// Channel delivers a notification through a specific transport.
type Channel interface {
	Name() string
	Send(ctx context.Context, msg model.Message) error
}
