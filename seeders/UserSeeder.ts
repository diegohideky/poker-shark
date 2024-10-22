import "reflect-metadata";
import { DataSource } from "typeorm";
import bcrypt from "bcrypt";
import { User } from "@entities/User";
import { Role } from "@entities/Role";
import { UserRole } from "@entities/UserRole";

export const UserSeeder = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);
  const userRoleRepository = dataSource.getRepository(UserRole);

  // Fetch the ADMIN role
  const adminRole = await roleRepository.findOneBy({ name: "ADMIN" });

  const users = [
    {
      username: "adminUser",
      password: "securepassword", // Password to be hashed
      roles: adminRole ? [adminRole] : [],
    },
  ];

  for (const user of users) {
    let newUser = null;
    // Check if the user already exists
    const existingUser = await userRepository.findOneBy({
      username: user.username,
    });

    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10); // 10 is the salt rounds

    if (existingUser) {
      // Update existing user
      existingUser.password = hashedPassword;
      await userRepository.save(existingUser);
      console.log(`Updated user: ${existingUser.username}`);
    } else {
      // Create new user
      const data = userRepository.create({
        username: user.username,
        password: hashedPassword, // Save the hashed password
      });
      newUser = await userRepository.save(data);
      console.log(`Created user: ${newUser.username}`);
    }

    // Handle roles
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
