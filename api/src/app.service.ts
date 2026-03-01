import { Injectable } from '@nestjs/common';

@Injectable() // makes it available for depedency injection and the we lable it as a provider in the app.module
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

//contains the business logic for the root controller
