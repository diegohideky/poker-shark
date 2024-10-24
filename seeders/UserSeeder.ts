import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@entities/User";
import { Role } from "@entities/Role";
import { UserRole } from "@entities/UserRole";
import { encryptPassword } from "@libs/password";

export const UserSeeder = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);
  const userRoleRepository = dataSource.getRepository(UserRole);

  const adminRole = await roleRepository.findOneBy({ name: "ADMIN" });

  const users = [
    {
      name: process.env.ADMIN_USER_NAME,
      username: process.env.ADMIN_USER_USER_NAME,
      password: process.env.ADMIN_USER_PASSWORD, // Password to be hashed
      roles: adminRole ? [adminRole] : [],
    },
  ];

  for (const user of users) {
    let newUser = null;
    const existingUser = await userRepository.findOneBy({
      username: user.username,
    });

    const hashedPassword = await encryptPassword(user.password);

    if (existingUser) {
      // Update existing user
      existingUser.password = hashedPassword;
      await userRepository.save(existingUser);
      console.log(`Updated user: ${existingUser.username}`);
    } else {
      const data = userRepository.create({
        name: user.name,
        username: user.username,
        password: hashedPassword, // Save the hashed password
      });
      newUser = await userRepository.save(data);
      console.log(`Created user: ${newUser.username}`);
    }

    if (user.roles) {
      for (const role of user.roles) {
        const userRole = userRoleRepository.create({
          userId: existingUser?.id || newUser?.id, // Use existing user if it was found
          roleId: role.id,
        });
        await userRoleRepository.save(userRole);
        console.log(
          `Assigned role ${role.name} to user: ${
            (existingUser || newUser)?.username
          }`
        );
      }
    }
  }
};
