/* eslint-disable prettier/prettier */
import { TableColumn, MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductionStatusToSalesTable1665191081677
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'sales',
      new TableColumn({
        name: 'production_status',
        type: 'enum',
        enum: ['TO_DO', 'IN PROGRESS', 'DONE', 'PENDING'],
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('sales', 'production_status');
  }
}
