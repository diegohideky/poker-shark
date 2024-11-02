import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { TeamPlayer } from "./TeamPlayer";
import { SoftDeleteEntity } from "interfaces";

@Entity("teams")
export class Team extends SoftDeleteEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100, unique: true })
  name: string;

  @Column({ type: "uuid" })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.teams)
  @JoinColumn({ name: "ownerId" })
  owner: Relation<User>;

  @Column({ unique: true })
  pageName: string;

  @OneToMany(() => TeamPlayer, (teamPlayer) => teamPlayer.team)
  players: Relation<TeamPlayer[]>;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    default: "shield-default.jpeg",
  })
  photoUrl: string;
}
