import {
  ClientProviderOptions,
  Transport,
  KafkaOptions,
} from '@nestjs/microservices';

export const kafkaProducerConfig: ClientProviderOptions = {
  name: 'KAFKA_SERVICE',
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['localhost:9092'],
    },
  },
};

export const kafkaConsumerMicroserviceConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'logger-consumer',
    },
  },
};
