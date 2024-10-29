import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateMatchesPlayersTable1730125187801
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "matches_players",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "matchId",
            type: "uuid",
          },
          {
            name: "userId",
            type: "uuid",
          },
          {
            name: "score",
            type: "integer",
            default: 0,
            comment: "Player's score in cents",
          },
          {
            name: "position",
            type: "integer",
            isNullable: true,
            comment: "Player's position in the match",
          },
          {
            name: "status",
            type: "enum",
            enum: ["enrolled", "busted", "finished"],
            default: "'enrolled'",
          },
          {
            name: "rebuys",
            type: "integer",
            default: 0,
          },
          {
            name: "addons",
            type: "integer",
            default: 0,
          },
          {
            name: "stoppedAt",
            type: "timestamptz",
            isNullable: true,
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
      })
    );

    await queryRunner.createForeignKeys("matches_players", [
      new TableForeignKey({
        columnNames: ["matchId"],
        referencedColumnNames: ["id"],
        referencedTableName: "matches",
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("match_players");
  }
}
