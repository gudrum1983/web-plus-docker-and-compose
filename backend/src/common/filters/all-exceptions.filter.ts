import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let ex: HttpException = new InternalServerErrorException(
      'Что-то пошло не так',
    );

    if (exception instanceof HttpException) {
      ex = exception;
    } else if (exception instanceof QueryFailedError) {
      // Типизируем ошибку, чтобы получить её поля
      const err = exception.driverError;
      // Сравниваем код ошибки
      if (err.code === '23505') {
        const match = err.detail.match(/\((.*?)\)=\((.*?)\)/);
        if (match && match[1] === 'username') {
          const username = match[2];
          ex = new ConflictException(
            `Пользователь с именем "${username}" уже существует`,
          );
        } else if (match && match[1] === 'email') {
          const email = match[2];
          ex = new ConflictException(
            `Пользователь с email "${email}" уже существует`,
          );
        } else {
          ex = new ConflictException('Конфликт уникальности данных');
        }
      }
    }

    const httpStatus = ex.getStatus();
    response.status(httpStatus).json({
      message: ex.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
