package model

// Message is the notification payload consumed from RabbitMQ.
type Message struct {
	UserID   string            `json:"user_id"`
	Channels []string          `json:"channels"`
	Template string            `json:"template"`
	Subject  string            `json:"subject"`
	Data     map[string]string `json:"data"`
}
