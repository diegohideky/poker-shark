import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  BaseEntity,
} from "typeorm";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
