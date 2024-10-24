import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  BaseEntity,
  OneToMany,
  Relation,
} from "typeorm";
import { UserRole } from "./UserRole";

@Entity({ name: "roles" })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @DeleteDateColumn()
  deletedAt: Date | null; // Optional, can be null

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: Relation<UserRole[]>;
}
