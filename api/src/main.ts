import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //initializes the nestjs application with AppModule as the root
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  await app.listen(3000);
}

bootstrap();

//entry point for the entire node.js application like index.html in the front end

//when the app is deployed
//node.js process starts and executes this file first
//the async bootstrap function creates the application instance
//then the server binds to the specified port and waits for http requests 