import { Test } from '@nestjs/testing';
import { HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AbstractHttpAdapter } from '@nestjs/core';
import { HttpExceptionFilter } from '../httpException.filter';
import { ConfigsType } from '../../../configuration';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ResponseMessages } from '../../constants/response-messages.constant';
import { HttpAdapterHost } from '@nestjs/core';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let adapterHost: HttpAdapterHost;
  let configService: ConfigService<ConfigsType>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        {
          provide: HttpAdapterHost,
          useValue: {
            httpAdapter: {
              reply: jest.fn(),
              getRequestUrl: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('production'),
          },
        },
      ],
    }).compile();

    filter = moduleRef.get<HttpExceptionFilter>(HttpExceptionFilter);
    adapterHost = moduleRef.get<HttpAdapterHost>(HttpAdapterHost);
    configService = moduleRef.get<ConfigService<ConfigsType>>(ConfigService);
  });

  describe('catch', () => {
    it('should catch HttpException and return appropriate response', () => {
      const httpException = new HttpException(
        ResponseMessages.ROOM_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
      const host: any = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({}),
          getResponse: jest.fn().mockReturnValue({}),
        }),
      };

      filter.catch(httpException, host);

      expect(adapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        expect.anything(),
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: ResponseMessages.ROOM_NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    });

    it('should catch unknown exception and return appropriate response', () => {
      const unknownException = new Error('Something went wrong');
      const host: any = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({}),
          getResponse: jest.fn().mockReturnValue({}),
        }),
      };

      filter.catch(unknownException, host);

      expect(adapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        expect.anything(),
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ResponseMessages.SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });
});
