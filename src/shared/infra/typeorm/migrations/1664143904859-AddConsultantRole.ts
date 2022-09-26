import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddConsultantRole1664143904859 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'users',
      'role',
      new TableColumn({
        name: 'role',
        type: 'enum',
        enum: ['ADMIN', 'MANAGER', 'SELLER', 'NANOTECH_REPRESENTATIVE'],
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'users',
      'role',
      new TableColumn({
        name: 'role',
        type: 'enum',
        enum: ['ADMIN', 'MANAGER', 'SELLER'],
        isNullable: false,
      }),
    );
  }
}
