import { Team } from "@entities/Team";
import { Repository } from "typeorm";
import { toast } from "react-toastify";

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

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeButton: true,
    draggable: true,
  });
};

// Function to show error toast
export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeButton: true,
    draggable: true,
  });
};

// Function to show info toast
export const showInfoToast = (message: string) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeButton: true,
    draggable: true,
  });
};

export const getTextColor = (number) => {
  if (number > 0) {
    return "text-green-500";
  } else if (number < 0) {
    return "text-red-500";
  }

  return "text-white";
};
