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
import { Team } from "./Team";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: Relation<UserRole[]>;

  @OneToMany(() => Team, (team) => team.owner)
  teams: Relation<Team[]>;
}
