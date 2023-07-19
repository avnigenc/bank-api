import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AccountIdDto {
  @ApiProperty({
    description: 'Account identifier',
    example: 'efba5918-5d47-4bc9-95b8-1ea5d6ce6cd8',
  })
  @IsUUID()
  public accountId: string;
}
