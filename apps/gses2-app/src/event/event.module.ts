import { Module } from '@nestjs/common';
import { EventDispatcherService } from './event-dispatcher/service';

export const EventDispatcherToken = Symbol.for('EventDispatcherToken');

@Module({
  providers: [
    {
      provide: EventDispatcherToken,
      useClass: EventDispatcherService,
    },
  ],
  exports: [EventDispatcherToken],
})
export class EventModule {}
