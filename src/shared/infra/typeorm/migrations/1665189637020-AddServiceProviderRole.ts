import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddServiceProviderRole1665189637020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'users',
      'role',
      new TableColumn({
        name: 'role',
        type: 'enum',
        enum: [
          'ADMIN',
          'MANAGER',
          'SELLER',
          'NANOTECH_REPRESENTATIVE',
          'SERVICE_PROVIDER',
        ],
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
        enum: ['ADMIN', 'MANAGER', 'SELLER', 'NANOTECH_REPRESENTATIVE'],
        isNullable: false,
      }),
    );
  }
}
