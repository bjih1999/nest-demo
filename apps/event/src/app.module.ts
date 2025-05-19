import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/error/exception-filter';
import { ApplicationExceptionFilter } from './common/error/application-exception-filter';
import { LoggerModule } from './logger/logger.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      'mongodb://admin:event_admin_password@event-db:27017/event',
    ),
    LoggerModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ApplicationExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
