import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GetCategoryUseCase } from '@codeflix/micro-videos/category/application';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
