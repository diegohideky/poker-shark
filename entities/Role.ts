import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  BaseEntity,
} from "typeorm";

@Entity({ name: "roles" })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @DeleteDateColumn()
  deletedAt: Date | null; // Optional, can be null
}
