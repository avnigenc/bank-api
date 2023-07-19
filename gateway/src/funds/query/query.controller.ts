import { FundsQueryServiceClient, FUNDS_QUERY_SERVICE_NAME, GetBalanceResponse } from '@bank/sdk';
import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

@Controller('funds')
@ApiTags('Funds')
export class QueryController implements OnModuleInit {
  @Inject(FUNDS_QUERY_SERVICE_NAME)
  private readonly client: ClientGrpc;

  private service: FundsQueryServiceClient;

  public onModuleInit(): void {
    this.service = this.client.getService<FundsQueryServiceClient>(FUNDS_QUERY_SERVICE_NAME);
  }

  @Get(':fundId/balance')
  private getBalance(@Param() params: { fundId: string }): Observable<GetBalanceResponse> {
    return this.service.getBalance({ id: params.fundId });
  }
}
