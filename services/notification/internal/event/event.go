package event

import (
	"encoding/json"

	"notification/internal/domain"
)

// FromJSON decodes raw message body into a NotificationEvent.
// Returns an error if the payload is invalid.
func FromJSON(body []byte) (*domain.NotificationEvent, error) {
	var e domain.NotificationEvent
	if err := json.Unmarshal(body, &e); err != nil {
		return nil, err
	}
	if e.Data == nil {
		e.Data = make(map[string]interface{})
	}
	return &e, nil
}
