import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  OneToMany,
  Relation,
  // Relation,
} from "typeorm";
import { UserRole } from "./UserRole";
import { SoftDeleteEntity } from "interfaces";

export enum RoleNames {
  ADMIN = "ADMIN",
  TEAM_ADMIN = "TEAM ADMIN",
  PLAYER = "PLAYER",
}

@Entity({ name: "roles" })
export class Role extends SoftDeleteEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @DeleteDateColumn()
  deletedAt: Date | null; // Optional, can be null

  @OneToMany(() => UserRole, (userRole) => userRole.role, {
    nullable: true,
  })
  userRoles?: Relation<UserRole[]>;
}
