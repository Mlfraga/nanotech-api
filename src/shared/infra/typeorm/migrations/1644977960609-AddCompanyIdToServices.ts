import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCompanyIdToServices1644977960609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'services',
      new TableColumn({
        name: 'company_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('services', 'company_id');
  }
}
