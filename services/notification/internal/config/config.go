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
		AMQPURL:           getEnv("AMQP_URL", "amqp://guest:guest@localhost:5672/"),
		NotificationQueue: getEnv("NOTIFICATION_QUEUE", "notifications"),
	}
}

func getEnv(key, defaultVal string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return defaultVal
}
