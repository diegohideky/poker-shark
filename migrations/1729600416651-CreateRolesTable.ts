import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateRolesTable1729600416651 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "roles",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "deletedAt",
            type: "timestamptz",
            isNullable: true,
          },
          { name: "createdAt", type: "timestamptz", default: "now()" },
          { name: "updatedAt", type: "timestamptz", default: "now()" },
        ],
      }),
      true
    );

    // Create partial unique index for name where deletedAt is NULL
    await queryRunner.createIndex(
      "roles",
      new TableIndex({
        name: "IDX_ROLE_NAME_UNIQUE",
        columnNames: ["name", "deletedAt"],
        isUnique: true,
        where: `"deletedAt" IS NULL`, // Partial unique constraint
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("roles", "IDX_ROLE_NAME_UNIQUE");
    await queryRunner.dropTable("roles");
  }
}
