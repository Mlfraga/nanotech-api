/* eslint-disable prettier/prettier */
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddCompanyPriceToServices1646277042163
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'services',
      new TableColumn({
        name: 'company_price',
        type: 'numeric',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'services',
      new TableForeignKey({
        name: 'CompanyServices',
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        columnNames: ['company_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('services', 'company_price');
    await queryRunner.dropForeignKey('services', 'CompanyServices');
  }
}
