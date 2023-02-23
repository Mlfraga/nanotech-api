import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCommissionerToUserRole1676598948738 implements MigrationInterface {
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
            'COMMISSIONER',
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
}
