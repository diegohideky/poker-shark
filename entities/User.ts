import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
} from "typeorm";
import { UserRole } from "./UserRole";
import { Team } from "./Team";
import { SoftDeleteEntity } from "interfaces";

@Entity({ name: "users" })
export class User extends SoftDeleteEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    default: "user-picture-default.avif",
  })
  photoUrl: string | null;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: Relation<UserRole[]>;

  @OneToMany(() => Team, (team) => team.owner)
  teams: Relation<Team[]>;
}
