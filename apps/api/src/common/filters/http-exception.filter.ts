import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { IncidentsService } from '../../modules/incidents/incidents.service';

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private incidentsService?: IncidentsService) { }

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : (exception as any).message || 'Internal server error';

    if (status === HttpStatus.INTERNAL_SERVER_ERROR && this.incidentsService) {
      await this.incidentsService.logIncident({
        title: 'Unhandled Server Error',
        severity: 'HIGH',
        module: 'API_GLOBAL',
        message: typeof message === 'string' ? message : (message as any).message || 'Unknown error',
        context: { path: request.url, stack: (exception as any).stack },
      });
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'string' ? message : (message as any).message || message,
    });
  }
}
