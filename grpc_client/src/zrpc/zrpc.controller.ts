import { Metadata, ServerDuplexStream } from '@grpc/grpc-js';
import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import {
  ClientGrpc,
  ClientProxyFactory,
  GrpcMethod,
  GrpcOptions,
  GrpcStreamCall,
  GrpcStreamMethod,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { ZMessagePack, ZrpcService } from './zrpc.interface';


@Controller('zrpc')
export class ZrpcController implements OnModuleInit {
  private traceId: number = 0;
  private zrpcService: ZrpcService;
  private zrpcRepSub$: ReplaySubject<ZMessagePack>;
  // constructor(@Inject('ZRPC_PACKAGE') private readonly client: ClientGrpc) { }

  sendZrpcReq(data: string): boolean {
    if (this.zrpcRepSub$ == null || this.zrpcRepSub$ == undefined) {
      console.log("this.zrpcRepSub$ 尚未初始化", this.zrpcRepSub$);
      return false
    }
    this.traceId += 1;
    const pack = { traceId: "C_" + this.traceId, data: "客户端:开始请求" }

    this.zrpcRepSub$.next(pack);
    console.log("sendZrpcReq:", pack);
    return true;
  }
  onModuleInit() {
    console.log("加载ZrpcController onModuleInit");

    // this.zrpcService = this.client.getService<ZrpcService>('ZrpcService');
    this.zrpcService = ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: "0.0.0.0:3000",
        package: 'zrpc',
        protoPath: join(__dirname, '../../../proto/zrpc.proto'),
      },
    }).getService<ZrpcService>('ZrpcService');


    // 根据grpcServiceConfigs创建多个grpc服务
    // const grpcServices = grpcServiceConfigs.map(grpcServiceConfig => {
    //   return ClientProxyFactory.create(grpcServiceConfig);
    // });

    this.zrpcRepSub$ = new ReplaySubject<ZMessagePack>();



    const stream = this.zrpcService.Stream(this.zrpcRepSub$.asObservable());
    stream.subscribe({
      next: (resData) => {
        if (resData.data) {
          console.log(`zrpc next`, resData);
        }
      },
      error: (err) => {
        console.log(`zrpc fail:${err}`);

        this.zrpcRepSub$.complete();
        this.zrpcRepSub$.unsubscribe();
        this.zrpcRepSub$ = null;
      },
      complete: () => {
        console.log(`zrpc complete`);
      },
    })
  }
  async onApplicationBootstrap() {
    this.sendZrpcReq("客户端:开始请求");
    console.log("加载ZrpcController onApplicationBootstrap");
    setInterval(() => {
      this.sendZrpcReq("客户端定时请求:" + Date.now().toString());
    }, 5000)
  }



}
