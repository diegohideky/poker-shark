import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateTeamsTable1729949220114 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the teams table
    await queryRunner.createTable(
      new Table({
        name: "teams",
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
            length: "100",
            isUnique: true,
          },
          {
            name: "pageName",
            type: "varchar",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "ownerId",
            type: "uuid",
          },
          {
            name: "photoUrl",
            type: "varchar",
            length: "255",
            isNullable: false,
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

    // Add foreign key to link teams.ownerId to users.id
    await queryRunner.createForeignKey(
      "teams",
      new TableForeignKey({
        name: "FK_ownerId",
        columnNames: ["ownerId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key first, then drop the table
    await queryRunner.dropForeignKey("teams", "FK_ownerId"); // Replace with actual FK name if auto-generated
    await queryRunner.dropTable("teams");
  }
}
