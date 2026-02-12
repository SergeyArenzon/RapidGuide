package domain

import "time"

// Channel represents a delivery medium for notifications (email, sms, websocket, etc.).
type Channel string

const (
	ChannelEmail     Channel = "email"
	ChannelSMS       Channel = "sms"
	ChannelWebsocket Channel = "websocket"
)

// NotificationEvent is the contract published by other services to the notification queue.
// It describes a domain event that may result in one or more user notifications.
type NotificationEvent struct {
	// Source service name: "auth", "booking", "tour", etc.
	Source string `json:"source"`
	// Type is a fully-qualified event type such as "booking.created".
	Type string `json:"type"`
	// UserID is the primary user to notify.
	UserID string `json:"userId"`
	// Channels optionally overrides which channels to use for this event.
	// If empty, routing rules or user preferences determine channels.
	Channels []Channel `json:"channels,omitempty"`
	// Template is a logical template name, e.g. "booking_created".
	Template string `json:"template"`
	// Data is an arbitrary payload used to render templates.
	Data map[string]interface{} `json:"data"`
}

// Notification represents a concrete notification that the service intends to deliver.
// It is derived from a NotificationEvent plus routing rules and preferences.
type Notification struct {
	ID       string                 // internal ID, e.g. UUID
	UserID   string                 // who to notify
	Channels []Channel              // channels to deliver on
	Template string                 // template identifier
	Data     map[string]interface{} // template data

	Status    string     // "pending", "sent", "failed", etc.
	CreatedAt time.Time  // when the notification was created
	SentAt    *time.Time // when it was successfully sent (if applicable)
}

