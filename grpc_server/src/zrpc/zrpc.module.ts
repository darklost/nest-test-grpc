import { Module } from '@nestjs/common';
import { ZrpcController } from './Zrpc.controller';

@Module({
  imports: [],
  controllers: [ZrpcController],
  providers: [/*ZrpcService*/],
})
export class ZrpcModule { }
