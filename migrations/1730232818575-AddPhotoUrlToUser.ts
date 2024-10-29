import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPhotoUrlToUser1730232818575 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "photoUrl",
        type: "varchar",
        isNullable: true, // Set to true to avoid issues with existing records
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "photoUrl");
  }
}
