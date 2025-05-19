import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './user/event.controller';
import { EventService } from './user/event.service';
import { EventOperatorController } from './operator/event.operator.controller';
import { EventOperatorService } from './operator/event.operator.service';
import { EventAuditorController } from './auditor/event.auditor.controller';
import { EventAuditorService } from './auditor/event.auditor.service';
import { Event, EventSchema } from '../db/schemas/event.schema';
import { Reward, RewardSchema } from '../db/schemas/reward.schema';
import { RewardRequest, RewardRequestSchema } from '../db/schemas/reward-request.schema';
import { UserActivity, UserActivitySchema } from '../db/schemas/user-activity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: RewardRequest.name, schema: RewardRequestSchema },
      { name: UserActivity.name, schema: UserActivitySchema },
    ]),
  ],
  controllers: [EventController, EventOperatorController, EventAuditorController],
  providers: [EventService, EventOperatorService, EventAuditorService],
})
export class EventModule {}