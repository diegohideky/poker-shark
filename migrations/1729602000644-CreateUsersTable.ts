import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateUsersTable1729602000644 implements MigrationInterface {
  // Create User table
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "username",
            type: "varchar",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "password",
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
      })
    );

    // Create partial unique index for username where deletedAt is NULL
    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "IDX_USER_USERNAME_UNIQUE",
        columnNames: ["username", "deletedAt"],
        isUnique: true,
        where: `"deletedAt" IS NULL`, // Partial unique constraint
      })
    );

    // Create User_Role join table
    await queryRunner.createTable(
      new Table({
        name: "users_roles",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "userId",
            type: "uuid",
          },
          {
            name: "roleId",
            type: "uuid",
          },
          {
            name: "deletedAt",
            type: "timestamptz",
            isNullable: true,
          },
          { name: "createdAt", type: "timestamptz", default: "now()" },
          { name: "updatedAt", type: "timestamptz", default: "now()" },
        ],
      })
    );

    // Add foreign key for User table
    await queryRunner.createForeignKey(
      "users_roles",
      new TableForeignKey({
        name: "FK_users_roles_userId",
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    // Add foreign key for Role table
    await queryRunner.createForeignKey(
      "users_roles",
      new TableForeignKey({
        name: "FK_users_roles_roleId",
        columnNames: ["roleId"],
        referencedColumnNames: ["id"],
        referencedTableName: "roles",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys for the join table
    await queryRunner.dropForeignKey("users_roles", "FK_users_roles_userId");
    await queryRunner.dropForeignKey("users_roles", "FK_users_roles_roleId");

    // Drop User_Role join table
    await queryRunner.dropTable("users_roles");

    // Drop partial unique index for username
    await queryRunner.dropIndex("users", "IDX_USER_USERNAME_UNIQUE");

    // Drop User table
    await queryRunner.dropTable("users");
  }
}
