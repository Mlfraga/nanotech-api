import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSales1620874435570 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sales',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'client_identifier',
            type: 'int',
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'request_date',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'availability_date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'delivery_date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDING', 'CONFIRMED', 'CANCELED', 'FINISHED'],
            isNullable: false,
          },
          {
            name: 'company_value',
            type: 'numeric',
            isNullable: false,
          },
          {
            name: 'cost_value',
            type: 'numeric',
            isNullable: false,
          },
          {
            name: 'source',
            type: 'enum',
            enum: ['NEW', 'USED', 'WORKSHOP'],
            isNullable: false,
          },
          {
            name: 'comments',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'seller_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'unit_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'person_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'car_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'SellerSale',
            referencedTableName: 'profiles',
            referencedColumnNames: ['id'],
            columnNames: ['seller_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'UnitSale',
            referencedTableName: 'unities',
            referencedColumnNames: ['id'],
            columnNames: ['unit_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'PersonSale',
            referencedTableName: 'persons',
            referencedColumnNames: ['id'],
            columnNames: ['person_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'CarSale',
            referencedTableName: 'cars',
            referencedColumnNames: ['id'],
            columnNames: ['car_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sales');
  }
}
