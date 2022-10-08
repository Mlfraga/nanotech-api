/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddSalesServiceProvidersTable1665189774793
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sales_service_providers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'sale_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'service_provider_profile_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: 'ServiceProviderSale',
            referencedTableName: 'sales',
            referencedColumnNames: ['id'],
            columnNames: ['sale_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'ServiceProvider',
            referencedTableName: 'profiles',
            referencedColumnNames: ['id'],
            columnNames: ['service_provider_profile_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sales_service_providers');
  }
}
