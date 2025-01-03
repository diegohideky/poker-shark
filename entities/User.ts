import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
  // Relation,
} from "typeorm";
import { UserRole } from "./UserRole";
// import { Team } from "./Team";
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

  @Column({
    type: "varchar",
    nullable: true,
    comment: "A random key, CPF, email, or cellphone number for PIX",
  })
  pix: string | null;

  @Column({
    type: "boolean",
    default: false,
    comment: "Indicates if the user should appear in the ranking",
  })
  showInRanking: boolean;

  @OneToMany(() => UserRole, (userRole) => userRole.user, {
    nullable: true,
  })
  userRoles?: Relation<UserRole[]>;

  // @OneToMany(() => Team, (team) => team.owner)
  // teams: Relation<Team[]>;
}
