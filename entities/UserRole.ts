import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  BaseEntity,
} from "typeorm";

@Entity({ name: "users_roles" })
export class UserRole extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column()
  roleId: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
