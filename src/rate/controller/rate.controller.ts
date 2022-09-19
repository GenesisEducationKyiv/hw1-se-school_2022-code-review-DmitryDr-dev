import {
  BadRequestException,
  Controller,
  Get,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../common/filters';
import { RateService } from '../service';
import { IRateController } from './rate.controller.interface';

@Controller()
export class RateController implements IRateController {
  constructor(private rateService: RateService) {}

  @Get('rate')
  @UseFilters(new HttpExceptionFilter())
  public async getExchangeRate() {
    try {
      const result = await this.rateService.getBtcToUah();

      return result;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
