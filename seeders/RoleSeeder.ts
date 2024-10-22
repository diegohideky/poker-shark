import "reflect-metadata";
import { DataSource } from "typeorm";
import { Role } from "@entities/Role";

export const RoleSeeder = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(Role);

  const roles = [{ name: "ADMIN" }, { name: "TEAM ADMIN" }, { name: "PLAYER" }];

  for (const role of roles) {
    const existingRole = await roleRepository.findOneBy({ name: role.name });
    if (!existingRole) {
      const newRole = roleRepository.create(role);
      await roleRepository.save(newRole);
      console.log(`Created role: ${newRole.name}`);
    } else {
      console.log(`Role already exists: ${existingRole.name}`);
    }
  }
};
