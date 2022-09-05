import {
  BadRequestException,
  Controller,
  Get,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filters';
import { RateService } from './rate.service';

@Controller()
export class RateController {
  constructor(private rateService: RateService) {}

  @Get('rate')
  @UseFilters(new HttpExceptionFilter())
  public async getExchangeRate() {
    const result = await this.rateService.getBtcToUah();

    if (!result) throw new BadRequestException();

    return result;
  }
}
