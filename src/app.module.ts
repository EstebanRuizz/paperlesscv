import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HttpControllerModule } from './presentation/http-controller.module';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PersistenceModule,
    HttpControllerModule,
  ],
  providers: [],
})
export class AppModule {}
