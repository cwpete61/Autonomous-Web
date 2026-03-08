import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../modules/prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body } = request;

    // Only log mutations (POST, PATCH, PUT, DELETE)
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return next.handle();
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap(async (response) => {
        const duration = Date.now() - startTime;
        
        try {
          await this.prisma.auditLog.create({
            data: {
              actorId: user?.id || null,
              actorType: 'USER',
              action: `${method} ${url}`,
              targetType: this.getResourceType(url),
              targetId: this.getResourceId(url, response),
              metadata: {
                requestBody: this.sanitizeBody(body),
                duration,
                statusCode: context.switchToHttp().getResponse().statusCode,
              } as any,
            },
          });
        } catch (error) {
          this.logger.error(`Failed to create audit log: ${error.message}`);
        }
      }),
    );
  }

  private getResourceType(url: string): string {
    const parts = url.split('/');
    return parts[1] || 'unknown';
  }

  private getResourceId(url: string, response: any): string {
    // Try to extract ID from URL or response
    const parts = url.split('/');
    if (parts.length > 2 && parts[2]?.length > 10) return parts[2];
    return response?.id || 'n/a';
  }

  private sanitizeBody(body: any): any {
    if (!body) return {};
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard'];
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) sanitized[field] = '********';
    }
    
    return sanitized;
  }
}
