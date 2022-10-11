import { BadRequestException, Controller, Get } from '@nestjs/common';
import { RateService } from '../service';

@Controller()
export class RateController {
  constructor(private rateService: RateService) {}

  @Get('rate')
  public async getExchangeRate(): Promise<number> {
    try {
      const result = await this.rateService.getBtcToUah();

      return result;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
