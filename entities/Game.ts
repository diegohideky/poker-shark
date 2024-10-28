import { SoftDeleteEntity } from "interfaces";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("games")
export class Game extends SoftDeleteEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;
}
