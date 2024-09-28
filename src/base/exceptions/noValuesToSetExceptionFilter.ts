import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TranslatedError } from './postgresExceptionFilter';
import { NoValuesToSetException } from './custom/noValuesToSetException';
import { BaseExceptionFilter } from '@nestjs/core';
@Catch(NoValuesToSetException)
export class NoValuesToSetExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const translatedError = this.otherErrorsTranslator(exception.message);

    response.status(translatedError.statusCode).json({
      message: translatedError.message,
      timestamp: new Date().toISOString(),
    });
  }

  private otherErrorsTranslator(message: string): TranslatedError {
    switch (message) {
      case 'No values to set':
        return {
          message: 'Unprocessable Entity: No values to set',
          statusCode: 422,
        };
      default:
        return null;
    }
  }
}
