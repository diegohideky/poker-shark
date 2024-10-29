import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMatchesTable1730122649723 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "matches",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            default: `concat('Poker Table ', CURRENT_DATE)`,
          },
          {
            name: "gameId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "datetime",
            type: "timestamptz",
            isNullable: false,
          },
          {
            name: "teamId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "timestamptz",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamptz",
            default: "now()",
          },
          {
            name: "deletedAt",
            type: "timestamptz",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["gameId"],
            referencedTableName: "games",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
          {
            columnNames: ["teamId"],
            referencedTableName: "teams",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("matches");
  }
}
