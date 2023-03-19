import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';


function format(bytes: number) {
  return (bytes / 1024 / 1024).toFixed(2) + 'MB';
}

function printMemoryUsage() {
  const { heapTotal, heapUsed, rss, external, arrayBuffers } =
    process.memoryUsage();

  console.log(
    `rss ${format(rss)} heapTotal ${format(heapTotal)} heapUsed ${format(
      heapUsed,
    )} external ${format(external)} arrayBuffers ${format(arrayBuffers)}`,
    'Process MemoryUsage',
  );
}

async function bootstrap() {


  // const PROTO_PATH = __dirname + '/proto/zrpc.proto';
  // const options = {
  //   keepCase: true,
  //   longs: String,
  //   enums: String,
  //   defaults: true,
  //   oneofs: true
  // }

  // const  zrpcPackageDefinition = protoLoader.loadSync(PROTO_PATH, options);
  // const ZRpcGrpcObject = grpc.loadPackageDefinition(zrpcPackageDefinition);
  // const zrpcPackage = ZRpcGrpcObject["ZRpc"]
  // const ZrpcService = zrpcPackage["ZRpcService"]
  // const server = new grpc.Server();
  // server.addService(ZrpcService.service, 
  //   {Stream: async (client: any)=>{
  //     console.log(client)

  //   }}
  // );
  // server.bind('0.0.0.0:4500', grpc.ServerCredentials.createInsecure());
  // server.start();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'zrpc',
      url: "0.0.0.0:3000",
      protoPath: join(__dirname, '../../proto/zrpc.proto'),
    }
  });
  await app.listen();
  setInterval(printMemoryUsage, 5000);
}
bootstrap();
