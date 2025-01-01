import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { createTeam } from "@services/teams";
import { showErrorToast, showInfoToast, showSuccessToast } from "@libs/utils";
import LoadingOverlay from "@components/LoadingOverlay";

const NewTeam = () => {
  const [name, setName] = useState("");
  const [pageName, setPageName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handlePageNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    // Convert spaces to dashes, remove invalid characters, and convert to lowercase
    const formattedPageName = input
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/[^a-z0-9-]/g, ""); // Remove characters that are not letters, numbers, or dashes
    setPageName(formattedPageName);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name || !pageName || !photo) {
      showInfoToast("Please fill in all fields and upload a photo.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("pageName", pageName);
    formData.append("photo", photo);

    try {
      const team = await createTeam(formData);
      showSuccessToast("Team created successfully!");
      router.push(`/t/${team.pageName}`);
    } catch (error) {
      showErrorToast((error as any).response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg md:mx-auto m-10 p-5 bg-white shadow-md rounded-lg">
      <LoadingOverlay isLoading={isLoading} />
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Team</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter team name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Name
          </label>
          <input
            type="text"
            value={pageName}
            onChange={handlePageNameChange}
            className="w-full p-2 border rounded"
            placeholder="Enter page name (e.g., grand-splendor)"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Only lowercase letters, numbers, and dashes are allowed. Spaces will
            be converted to dashes automatically.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Team
        </button>
      </form>
    </div>
  );
};

export default NewTeam;
