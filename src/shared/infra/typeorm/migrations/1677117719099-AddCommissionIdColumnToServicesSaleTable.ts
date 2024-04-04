/* eslint-disable brace-style */
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from 'typeorm';

export class AddCommissionIdColumnToServicesSaleTable1677117719099
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('services_sales', [
      new TableColumn({
        name: 'commissioner_id',
        type: 'uuid',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKey(
      'services_sales',
      new TableForeignKey({
        name: 'ServiceSaleCommissioner',
        referencedTableName: 'profiles',
        referencedColumnNames: ['id'],
        columnNames: ['commissioner_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('services_sales', [
      new TableColumn({
        name: 'commissioner_id',
        type: 'numeric',
        isNullable: true,
      }),
    ]);

    await queryRunner.dropForeignKey(
      'services_sales',
      new TableForeignKey({
        name: 'ServiceSaleCommissioner',
        referencedTableName: 'profiles',
        referencedColumnNames: ['id'],
        columnNames: ['commissioner_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }
}
