/* eslint-disable brace-style */
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDateToBeDoneSalesServiceProvidersTable1665349904939
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'sales_service_providers',
      new TableColumn({
        name: 'date_to_be_done',
        type: 'timestamp',
        default: 'now()',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('sales_service_providers', 'date_to_be_done');
  }
}
