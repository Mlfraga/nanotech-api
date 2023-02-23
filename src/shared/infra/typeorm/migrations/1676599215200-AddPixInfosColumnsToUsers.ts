import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPixInfosColumnsToUsers1676599215200 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumns('users', [
        new TableColumn({
          name: 'pix_key_type',
          type: 'enum',
          enum: ['CPF', 'PHONE', 'EMAIL', 'RANDOM'],
          isNullable: true
        }),
        new TableColumn({
          name: 'pix_key',
          type: 'varchar',
          isNullable: true
        }),
      ]
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumns('users', [
        new TableColumn({
          name: 'pix_key_type',
          type: 'enum',
          enum: ['CPF', 'PHONE', 'EMAIL', 'RANDOM'],
          isNullable: true
        }),
        new TableColumn({
          name: 'pix_key',
          type: 'varchar',
          isNullable: true
        }),
      ]);
    }
}
