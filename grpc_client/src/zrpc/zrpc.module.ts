import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ZrpcController } from './zrpc.controller';

@Module({
  imports: [

    ConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: 'ZRPC_PACKAGE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: "0.0.0.0:3000",
            package: 'zrpc',
            protoPath: join(__dirname, '../../../proto/zrpc.proto'),
          },
        }),
      },
    ]),

  ],
  controllers: [ZrpcController],
  providers: [/*ZrpcService*/],
})
export class ZrpcModule { }
