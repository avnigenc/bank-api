import {
  AccountCommandServiceClient,
  AccountIdDto,
  ACCOUNT_COMMAND_SERVICE_NAME,
  CloseAccountResponse,
  OpenAccountRequest,
  OpenAccountResponse,
} from '@bank/sdk';
import { Body, Controller, Delete, Inject, OnModuleInit, Param, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

@Controller('accounts')
@ApiTags('Accounts')
export class CommandController implements OnModuleInit {
  @Inject(ACCOUNT_COMMAND_SERVICE_NAME)
  private readonly client: ClientGrpc;

  private service: AccountCommandServiceClient;

  public onModuleInit(): void {
    this.service = this.client.getService<AccountCommandServiceClient>(ACCOUNT_COMMAND_SERVICE_NAME);
  }

  @Post()
  private openAccount(@Body() payload: OpenAccountRequest): Observable<OpenAccountResponse> {
    return this.service.openAccount(payload);
  }

  @Delete(':accountId')
  private closeAccount(@Param() params: AccountIdDto): Observable<CloseAccountResponse> {
    return this.service.closeAccount({ id: params.accountId });
  }
}
