import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarsModule } from './cars/cars.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import { BookingsModule } from './bookings/bookings.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Rate Limiting: Dakikada max 60 istek, login için ayrıca kısıtlanacak
    ThrottlerModule.forRoot([{
      ttl: 60000,   // 60 saniye
      limit: 60,    // max 60 istek
    }]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CarsModule,
    UsersModule,
    AuthModule,
    BookingsModule,
    PaymentsModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Rate limiting guard'ı global olarak uygula
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
