package rabbitmq

import (
	"context"
	"log"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

// Handler is called for each consumed message. Return nil to ack, non-nil to nack.
type Handler func(ctx context.Context, body []byte) error

// Consumer consumes messages from a RabbitMQ queue and calls the handler.
type Consumer struct {
	conn    *amqp.Connection
	channel *amqp.Channel
	queue   string
	handler Handler
}

// NewConsumer connects to RabbitMQ and creates a consumer. Call Run to start consuming.
func NewConsumer(amqpURL, queue string, handler Handler) (*Consumer, error) {
	conn, err := amqp.Dial(amqpURL)
	if err != nil {
		return nil, err
	}
	ch, err := conn.Channel()
	if err != nil {
		_ = conn.Close()
		return nil, err
	}
	_, err = ch.QueueDeclare(queue, true, false, false, false, nil)
	if err != nil {
		_ = ch.Close()
		_ = conn.Close()
		return nil, err
	}
	return &Consumer{conn: conn, channel: ch, queue: queue, handler: handler}, nil
}

// Run starts consuming. Blocks until context is cancelled. Reconnects on connection loss.
func (consumer *Consumer) Run(ctx context.Context) {
	for {
		deliveries, err := consumer.channel.Consume(consumer.queue, "notification-svc", false, false, false, false, nil)
		if err != nil {
			log.Printf("[rabbitmq] consume error: %v", err)
			select {
			case <-ctx.Done():
				return
			case <-time.After(5 * time.Second):
				continue
			}
		}
		for {
			select {
			case <-ctx.Done():
				return
			case d, ok := <-deliveries:
				if !ok {
					return
				}
				if err := consumer.handler(ctx, d.Body); err != nil {
					log.Printf("[rabbitmq] handler error: %v", err)
					_ = d.Nack(false, true)
				} else {
					_ = d.Ack(false)
				}
			}
		}
	}
}

// Close closes the channel and connection.
func (consumer *Consumer) Close() error {
	if consumer.channel != nil {
		_ = consumer.channel.Close()
	}
	if consumer.conn != nil {
		return consumer.conn.Close()
	}
	return nil
}

