import { Team } from "@entities/Team";
import { Repository } from "typeorm";

export async function generateUniquePageNames(
  name: string,
  teamRepo: Repository<Team>,
  suggestions: string[] = [],
  attempts: number = 0
): Promise<string[]> {
  const baseName = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  const suggestion =
    attempts === 0
      ? baseName
      : `${baseName}-${Math.floor(Math.random() * 1000)}`;

  const existingTeam = await teamRepo.findOne({
    where: { pageName: suggestion },
  });

  if (!existingTeam && !suggestions.includes(suggestion)) {
    suggestions.push(suggestion);
  }

  return suggestions.length < 3
    ? generateUniquePageNames(name, teamRepo, suggestions, attempts + 1)
    : suggestions;
}
