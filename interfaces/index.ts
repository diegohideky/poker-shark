import { BaseEntity, DeleteDateColumn } from "typeorm";

export abstract class SoftDeleteEntity extends BaseEntity {
  @DeleteDateColumn()
  deletedAt: Date | null;
}
