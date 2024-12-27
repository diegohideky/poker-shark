import { useState, ChangeEvent } from "react";
import { useUser } from "@contexts/UserContext";
import { changePassword, updatePhoto } from "@services/accounts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import LoadingOverlay from "@components/LoadingOverlay";
import { showErrorToast, showSuccessToast } from "@libs/utils";

const Profile: React.FC = () => {
  const { user, setUserData } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleChangePassword = async () => {
    setIsLoading(true);

    try {
      await changePassword(
        user.username,
        currentPassword,
        newPassword,
        confirmPassword
      );

      showSuccessToast("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      showErrorToast((error as any).response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await updatePhoto(formData);
      setUserData(response); // Update UserContext
      showSuccessToast("Photo updated successfully!");
    } catch (error) {
      console.log({ error });
      showErrorToast((error as any).response.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
      <LoadingOverlay isLoading={isLoading} />
      <h1 className="text-2xl font-bold mb-6 text-center">
        Hello {user?.username}
      </h1>

      {/* Change Photo */}
      <div className="mb-5">
        {user?.photoUrl && (
          <div className="flex align-center justify-center">
            <img
              src={`${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
              }/files/${user?.photoUrl || "user-picture-default.avif"}`}
              alt="Profile"
              className="mt-3 w-16 h-16 rounded-full"
            />
          </div>
        )}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Photo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Change Password */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showCurrentPassword ? "text" : "password"}
            className="w-full p-2 border rounded"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-2 top-2"
          >
            <FontAwesomeIcon
              //@ts-ignore
              icon={showCurrentPassword ? faEyeSlash : faEye}
              className="text-gray-500"
            />
          </button>
        </div>
        <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            className="w-full p-2 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-2 top-2"
          >
            <FontAwesomeIcon
              //@ts-ignore
              icon={showNewPassword ? faEyeSlash : faEye}
              className="text-gray-500"
            />
          </button>
        </div>
        <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full p-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-2"
          >
            <FontAwesomeIcon
              //@ts-ignore
              icon={showConfirmPassword ? faEyeSlash : faEye}
              className="text-gray-500"
            />
          </button>
        </div>
        <button
          onClick={handleChangePassword}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Profile;
