import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TranslatedError } from './postgresExceptionFilter';

export class NoValuesToSetException extends Error {
  constructor() {
    super('No values to set');
  }
}

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
        return {
          message: 'Internal Server Error',
          statusCode: 500,
        };
    }
  }
}
