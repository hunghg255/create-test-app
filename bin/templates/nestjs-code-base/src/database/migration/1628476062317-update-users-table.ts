import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class updateUsersTable1628476062317 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'task_count',
        type: 'int',
        unsigned: true,
        isNullable: false,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'task_count')
  }
}
