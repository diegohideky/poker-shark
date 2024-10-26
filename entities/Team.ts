import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  DeleteDateColumn,
  Relation,
} from "typeorm";
import { User } from "./User"; // Assuming the User entity is in the same folder

@Entity("teams")
export class Team extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100, unique: true })
  name: string;

  @Column({ type: "uuid" })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.teams)
  @JoinColumn({ name: "ownerId" })
  owner: Relation<User>;

  @Column({ type: "varchar", length: 255, nullable: true })
  photoUrl?: string;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
