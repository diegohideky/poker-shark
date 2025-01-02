import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
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

  @ManyToOne(() => User, (user) => user.userRoles, { cascade: false })
  @JoinColumn({ name: "userId" })
  user: Relation<User>;

  @ManyToOne(() => Role, (role) => role.userRoles, { cascade: false })
  @JoinColumn({ name: "roleId" })
  role: Relation<Role>;
}
