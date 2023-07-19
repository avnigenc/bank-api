import {
  DepositFundsResponse,
  FundsCommandServiceClient,
  FUNDS_COMMAND_SERVICE_NAME,
  TransferFundsResponse,
  WithdrawFundsResponse,
} from '@bank/sdk';
import { Body, Controller, Inject, OnModuleInit, Param, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

@Controller('funds')
@ApiTags('Funds')
export class CommandController implements OnModuleInit {
  @Inject(FUNDS_COMMAND_SERVICE_NAME)
  private readonly client: ClientGrpc;

  private service: FundsCommandServiceClient;

  public onModuleInit(): void {
    this.service = this.client.getService<FundsCommandServiceClient>(FUNDS_COMMAND_SERVICE_NAME);
  }

  @Post(':fundId/deposit')
  private depositFunds(
    @Param() params: { fundId: string },
    @Body() payload: { amount: number },
  ): Observable<DepositFundsResponse> {
    return this.service.depositFunds({ id: params.fundId, amount: payload.amount });
  }

  @Post(':fundId/withdraw')
  private withdrawFunds(
    @Param() params: { fundId: string },
    @Body() payload: { amount: number },
  ): Observable<WithdrawFundsResponse> {
    return this.service.withdrawFunds({ id: params.fundId, amount: payload.amount });
  }

  @Post(':fundId/transfer')
  private transferFunds(
    @Param() params: { fundId: string },
    @Body() payload: { toId: string; amount: number },
  ): Observable<TransferFundsResponse> {
    return this.service.transferFunds({ fromId: params.fundId, toId: payload.toId, amount: payload.amount });
  }
}
