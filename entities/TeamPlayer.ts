import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Relation,
} from "typeorm";
import { Team } from "./Team";
import { User } from "./User";
import { Role } from "./Role";
import { SoftDeleteEntity } from "interfaces";

export enum TeamPlayerStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
}

@Entity("teams_players")
export class TeamPlayer extends SoftDeleteEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Team, (team) => team.players, { onDelete: "CASCADE" })
  @JoinColumn({ name: "teamId" })
  team: Relation<Team>;

  @Column()
  teamId: string;

  @ManyToOne(() => User, (user) => user.teams, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: Relation<User>;

  @Column()
  userId: string;

  @ManyToOne(() => Role, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "roleId" })
  role: Relation<Role>;

  @Column({ nullable: true })
  roleId: string | null;

  @Column({
    type: "enum",
    enum: TeamPlayerStatus,
  })
  status: TeamPlayerStatus;
}