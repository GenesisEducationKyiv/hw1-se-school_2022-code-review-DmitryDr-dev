import { Inject, Injectable } from '@nestjs/common';
import { LocalDbName } from '../../common/constants';
import { ILocalDbServiceToken } from '../../database/local-db/local-db.module';
import { ILocalDbService } from '../../database/local-db/service';
import { ISubscriptionRepository } from './subscription.repository.interface';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(
    @Inject(ILocalDbServiceToken)
    private readonly localDbService: ILocalDbService,
  ) {}

  public async addOne(email: string): Promise<void> {
    try {
      await this.localDbService.addOne(LocalDbName.Email, email);
    } catch (error) {
      throw new Error(
        `Error occurred while adding contact to DB: ${error.message}`,
      );
    }
  }

  public async findAll(): Promise<Array<string>> {
    try {
      const result = await this.localDbService.findAll(LocalDbName.Email);

      return result;
    } catch (error) {
      throw new Error(
        `Error occurred while getting contacts from DB: ${error.message}`,
      );
    }
  }
}
