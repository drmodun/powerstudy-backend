import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { PostgresError } from 'postgres';

export interface TranslatedError {
  message: string;
  statusCode: number;
}

@Catch(PostgresError)
export class PostgresExceptionFilter implements ExceptionFilter {
  catch(exception: PostgresError, host: ArgumentsHost) {
    console.log(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const translatedError = this.postgresErrorCodeTranslator(exception.code);

    response.status(translatedError.statusCode).json({
      message: translatedError.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private postgresErrorCodeTranslator(code: string): TranslatedError {
    switch (code) {
      case '23505':
        return {
          message: 'Unproccessable Entity: Unique Entity Violation',
          statusCode: 409,
        };
      case '23503':
        return {
          message: 'Unprocessable Entity: Foreign Key Constraint',
          statusCode: 422,
        };
      case '42P01':
        return {
          message: 'Bad Request: Undefined Table',
          statusCode: 400,
        };
      case '42703':
        return {
          message: 'Unprocessable Entity: Undefined column mentioned',
          statusCode: 422,
        };
      case '08006':
        return {
          message: 'Service Unavailable: Database Connection Error',
          statusCode: 503,
        };
      case '53300':
        return {
          message: 'Service Unavailable: Too many connections',
          statusCode: 503,
        };
      case '57014':
        return {
          message: 'Service Unavailable: Database Timeout',
          statusCode: 503,
        };

      // TODO: add more error translations

      default:
        return {
          message: 'Internal Server Error',
          statusCode: 500,
        };
    }
  }
}
