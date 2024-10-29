import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
} from "typeorm";
import { Team } from "./Team";
import { Game } from "./Game";
import { SoftDeleteEntity } from "interfaces";

@Entity("matches")
export class Match extends SoftDeleteEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "text",
    default: () => `concat('Poker Table ', current_date::text)`,
  })
  name: string;

  @Column({ type: "uuid" })
  gameId: string;

  @Column({ type: "timestamptz" })
  datetime: Date;

  @Column({ type: "uuid" })
  teamId: string;

  @Column({ type: "integer", nullable: true })
  buyIn: number | null;

  @Column({ type: "integer", nullable: true })
  addOn: number | null;

  @ManyToOne(() => Game, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "gameId" })
  game: Relation<Game>;

  @ManyToOne(() => Team, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "teamId" })
  team: Relation<Team>;
}
