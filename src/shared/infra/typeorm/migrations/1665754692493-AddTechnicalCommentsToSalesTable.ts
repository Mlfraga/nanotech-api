/* eslint-disable brace-style */
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTechnicalCommentsToSalesTable1665753582392
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'sales',
      new TableColumn({
        name: 'techinical_comments',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('sales', 'techinical_comments');
  }
}
