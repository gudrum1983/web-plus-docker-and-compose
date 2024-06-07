import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor() {
    return;
  }
  @Get('')
  @Redirect('/api')
  index() {
    return;
  }
}
