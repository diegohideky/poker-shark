import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUUIDExtension1729600416000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // There is no way to drop the extension if it was created.
    // You might want to handle it manually or log a warning.
    await queryRunner.query("SELECT COUNT(1) FROM migrations");
  }
}
