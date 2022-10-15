/* eslint-disable brace-style */
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateProductionStatusEnum1665358608727
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'sales',
      new TableColumn({
        name: 'production_status',
        type: 'enum',
        enum: ['TO_DO', 'IN PROGRESS', 'DONE', 'PENDING'],
        isNullable: true,
      }),
      new TableColumn({
        name: 'production_status',
        type: 'enum',
        enum: ['TO_DO', 'IN_PROGRESS', 'DONE', 'PENDING'],
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'sales',
      new TableColumn({
        name: 'production_status',
        type: 'enum',
        enum: ['TO_DO', 'IN_PROGRESS', 'DONE', 'PENDING'],
        isNullable: true,
      }),
      new TableColumn({
        name: 'production_status',
        type: 'enum',
        enum: ['TO_DO', 'IN PROGRESS', 'DONE', 'PENDING'],
        isNullable: true,
      }),
    );
  }
}
