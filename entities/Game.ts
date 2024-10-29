import { SoftDeleteEntity } from "interfaces";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum GameTypes {
  CASH = "CASH",
  TOURNAMENT = "TOURNAMENT",
}

@Entity("games")
export class Game extends SoftDeleteEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;
}
