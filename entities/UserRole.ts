import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  BaseEntity,
  ManyToOne,
  Relation,
} from "typeorm";
import { User } from "./User";
import { Role } from "./Role";

@Entity({ name: "users_roles" })
export class UserRole extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column()
  roleId: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.userRoles)
  user: Relation<User>;

  @ManyToOne(() => Role, (role) => role.userRoles)
  role: Relation<Role>;
}
