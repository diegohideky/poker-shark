import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faShield } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "@contexts/UserContext";

const BottomNavBar = () => {
  const router = useRouter();
  const { user, setUserData } = useUser();

  const logout = () => {
    // Clear token from local storage
    localStorage.removeItem("token");

    // Clear user context
    setUserData(null);

    // Redirect to login page
    router.push("/accounts/login");
  };

  const navItems = [
    { label: "Teams", icon: faShield, action: () => router.push("/teams") },
    { label: "Logout", icon: faSignOutAlt, action: logout },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-around items-center h-16 shadow-lg">
      {/* User's Photo */}
      <div
        className="flex flex-col items-center space-y-1 cursor-pointer"
        onClick={() => router.push("/profile")}
      >
        <img
          src={`${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
          }/files/${user?.photoUrl}`}
          alt="User Photo"
          className="w-8 h-8 rounded-full"
        />
      </div>
      {navItems.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center space-y-1 cursor-pointer"
          onClick={item.action}
        >
          {/* @ts-ignore */}
          <FontAwesomeIcon icon={item.icon} size="1x" className="text-md" />
          <span className="text-sm">{item.label}</span>
        </div>
      ))}
    </nav>
  );
};

export default BottomNavBar;
