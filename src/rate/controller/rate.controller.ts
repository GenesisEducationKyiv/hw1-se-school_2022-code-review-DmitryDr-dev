import {
  BadRequestException,
  Controller,
  Get,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../common/filters';
import { RateService } from '../service';

@Controller()
export class RateController {
  constructor(private rateService: RateService) {}

  @Get('rate')
  @UseFilters(new HttpExceptionFilter())
  public async getExchangeRate(): Promise<number> {
    try {
      const result = await this.rateService.getBtcToUah();

      return result;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
