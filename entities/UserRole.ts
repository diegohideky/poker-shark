import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  Relation,
} from "typeorm";
import { User } from "./User";
import { Role } from "./Role";
import { SoftDeleteEntity } from "interfaces";

@Entity({ name: "users_roles" })
export class UserRole extends SoftDeleteEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column()
  roleId: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.userRoles, { nullable: true })
  user: Relation<User>;

  @ManyToOne(() => Role, (role) => role.userRoles, { nullable: true })
  role: Relation<Role>;
}
