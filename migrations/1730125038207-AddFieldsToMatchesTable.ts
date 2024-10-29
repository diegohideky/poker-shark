import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFieldsToMatchesTable1730125038207
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("matches", [
      new TableColumn({
        name: "buyIn",
        type: "integer",
        isNullable: true,
        comment: "Buy-in value in cents",
      }),
      new TableColumn({
        name: "addOn",
        type: "integer",
        isNullable: true,
        comment: "Add-on value in cents",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("matches", "buyIn");
    await queryRunner.dropColumn("matches", "addOn");
  }
}
