import { INestApplication, ValidationPipe } from '@nestjs/common';

export function configureApplication(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();
}
