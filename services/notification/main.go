package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"notification/internal/config"
	"notification/internal/rabbitmq"
)

func main() {
	cfg := config.Load()

	consumer, err := rabbitmq.NewConsumer(cfg.AMQPURL, cfg.NotificationQueue, func(ctx context.Context, body []byte) error {
		log.Printf("[notification] message: %s", string(body))
		return nil
	})
	if err != nil {
		log.Fatalf("rabbitmq: %v", err)
	}
	defer consumer.Close()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	log.Printf("notification service consuming from queue %q", cfg.NotificationQueue)
	consumer.Run(ctx)
}
