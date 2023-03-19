import { Metadata, ServerDuplexStream } from '@grpc/grpc-js';
import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import {
  GrpcMethod,
  GrpcStreamMethod,
} from '@nestjs/microservices';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { ZMessagePack } from './zrpc.interface';


@Controller('zrpc')
export class ZrpcController implements OnModuleInit {
  private traceId: number = 0;
  private zrpcSub$: Subject<ZMessagePack>;
  pushZrpcMsg(data: string): boolean {
    if (this.zrpcSub$ == null || this.zrpcSub$ == undefined) {
      console.log("pushZrpcMsg this.zrpcSub$ 尚未初始化", this.zrpcSub$);
      return false
    }
    this.traceId += 1;
    const pack = { traceId: "S_" + this.traceId, data: data };
    this.zrpcSub$.next(pack);
    console.log("pushZrpcMsg:", pack);
    return true;
  }
  onModuleInit() {
    console.log("加载ZrpcController onModuleInit");

  }
  async onApplicationBootstrap() {
    this.pushZrpcMsg("服务端:首次推送数据包");
    setInterval(() => {
      console.log("定时推送数据包");
      this.pushZrpcMsg("服务端:定时推送数据包");
    }, 1000)
  }



  @GrpcStreamMethod('ZrpcService', "Stream")
  Stream(messages$: Observable<ZMessagePack>, metadata: Metadata, call: ServerDuplexStream<any, any>): Observable<ZMessagePack> {
    console.log("Stream", messages$, metadata, call);
    this.zrpcSub$ = new Subject<ZMessagePack>();

    const onNext = (pack: ZMessagePack) => {
      console.log("onNext", pack);
      this.zrpcSub$.next({ traceId: pack.traceId, data: "服务端:响应数据包:" + pack.data });
    };


    const onComplete = () => {
      console.log("结束onComplete");
      this.zrpcSub$.complete();
    }
    messages$.subscribe({
      next: onNext,
      complete: onComplete,
    });



    return this.zrpcSub$.asObservable();
  }
}
