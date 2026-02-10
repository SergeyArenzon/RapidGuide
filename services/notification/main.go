package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"notification/internal/channel"
	"notification/internal/config"
	"notification/internal/handler"
	"notification/internal/rabbitmq"
)

func main() {
	cfg := config.Load()

	channels := map[string]channel.Channel{
		"email": &channel.EmailChannel{},
		"sms":   &channel.SMSChannel{},
		"push":  &channel.PushChannel{},
	}
	notificationHandler := handler.New(channels)

	consumer, err := rabbitmq.NewConsumer(cfg.AMQPURL, cfg.NotificationQueue, notificationHandler.Handle)
	if err != nil {
		log.Fatalf("rabbitmq: %v", err)
	}
	defer consumer.Close()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	log.Printf("notification service consuming from queue %q", cfg.NotificationQueue)
	consumer.Run(ctx)
}
