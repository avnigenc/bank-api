import {
  AccountIdDto,
  AccountQueryServiceClient,
  ACCOUNT_QUERY_SERVICE_NAME,
  FindAccountResponse,
  FindAllAccountsResponse,
} from '@bank/sdk';
import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

@Controller('accounts')
@ApiTags('Accounts')
export class QueryController implements OnModuleInit {
  @Inject(ACCOUNT_QUERY_SERVICE_NAME)
  private readonly client: ClientGrpc;

  private service: AccountQueryServiceClient;

  public onModuleInit(): void {
    this.service = this.client.getService<AccountQueryServiceClient>(ACCOUNT_QUERY_SERVICE_NAME);
  }

  @Get(':accountId')
  private findAccount(@Param() params: AccountIdDto): Observable<FindAccountResponse> {
    return this.service.findAccount({ id: params.accountId });
  }

  @Get()
  private findAllAccounts(@Param() params: { page: number }): Observable<FindAllAccountsResponse> {
    return this.service.findAllAccounts({ page: params.page });
  }
}
