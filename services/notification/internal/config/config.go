package config

import "os"

// Config holds application configuration from environment.
type Config struct {
	AMQPURL           string
	NotificationQueue string
}

// Load reads config from environment.
func Load() *Config {
	return &Config{
		AMQPURL:           os.Getenv("AMQP_URL"),
		NotificationQueue: os.Getenv("NOTIFICATION_QUEUE"),
	}
}


