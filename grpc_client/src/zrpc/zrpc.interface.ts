import { Observable } from "rxjs";

export interface ZMessagePack {
  traceId: string;
  data: string;
}

export interface ZrpcService {
  Stream(upstream: Observable<ZMessagePack>): Observable<ZMessagePack>;
}
