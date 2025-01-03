import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUsersPixAndShowInRankingFields1735869824310
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("users", [
      new TableColumn({
        name: "pix",
        type: "varchar",
        isNullable: true,
        comment: "A random key, CPF, email, or cellphone number for PIX",
      }),
      new TableColumn({
        name: "showInRanking",
        type: "boolean",
        default: false,
        comment: "Indicates if the user should appear in the ranking",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "pix");
    await queryRunner.dropColumn("users", "showInRanking");
  }
}
