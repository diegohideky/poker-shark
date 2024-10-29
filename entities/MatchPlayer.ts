import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Relation,
} from "typeorm";
import { Match } from "./Match";
import { User } from "./User";
import { SoftDeleteEntity } from "interfaces";

export enum MatchPlayerStatus {
  ENROLLED = "enrolled",
  BUSTED = "busted",
  FINISHED = "finished",
}

@Entity("matches_players")
export class MatchPlayer extends SoftDeleteEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Match, { onDelete: "CASCADE" })
  match: Relation<Match>;

  @Column()
  matchId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: Relation<User>;

  @Column()
  userId: string;

  @Column({ type: "integer", default: 0 })
  score: number | null;

  @Column({ type: "integer", nullable: true })
  position: number | null;

  @Column({
    type: "enum",
    enum: MatchPlayerStatus,
    default: MatchPlayerStatus.ENROLLED,
  })
  status: MatchPlayerStatus;

  @Column({ type: "integer", default: 0 })
  rebuys: number;

  @Column({ type: "integer", default: 0 })
  addons: number;

  @Column({ type: "timestamptz", nullable: true })
  stoppedAt: Date | null;
}
