import { ClientsModuleOptions, Transport } from '@nestjs/microservices';

const rabbitMqConfig: ClientsModuleOptions = [
  {
    name: 'USER_SERVICE',
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_HOST],
      queue: 'user_queue',
    },
  },
];

export default rabbitMqConfig;
