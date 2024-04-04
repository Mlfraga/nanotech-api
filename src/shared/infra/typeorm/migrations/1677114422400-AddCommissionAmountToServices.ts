/* eslint-disable brace-style */
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCommissionAmountToServices1677114422400
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('services', [
      new TableColumn({
        name: 'commission_amount',
        type: 'numeric',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('services', [
      new TableColumn({
        name: 'commission_amount',
        type: 'numeric',
        isNullable: true,
      }),
    ]);
  }
}
