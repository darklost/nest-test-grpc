import { Module } from '@nestjs/common';
import { ZrpcController } from './zrpc/zrpc.controller';
import { ZrpcModule } from './zrpc/zrpc.module';

@Module({
  imports: [ZrpcModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
