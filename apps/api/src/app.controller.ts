import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // passing nothiing to it means we are getting it from the root route local host
  getHello(): string {
    return this.appService.getHello();
  }
}

//handles https requests at the root route `/ `(where the front reaches the backend)
//uses dependency injection to access the appservice