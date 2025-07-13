import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

function removePassword(data: any) {
  if (Array.isArray(data)) return data.map((item: any) => removePassword(item));

  if (data && typeof data === 'object') {
    if (data instanceof Date) {
      return data.toISOString();
    }

    const cleanData = { ...data };

    if ('password' in cleanData) delete cleanData.password;

    for (const key in cleanData) {
      if (cleanData[key] && typeof cleanData[key] === 'object') {
        cleanData[key] = removePassword(cleanData[key]);
      }
    }

    return cleanData;
  }

  return data;
}

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => removePassword(data)));
  }
}
