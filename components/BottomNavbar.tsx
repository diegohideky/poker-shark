import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faShield,
  faChartColumn,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "@contexts/UserContext";

const BottomNavBar = () => {
  const router = useRouter();
  const { user, setUserData, setTokenData } = useUser();

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");

    setTokenData(null);
    setUserData(null);

    router.push("/accounts/login");
  };

  const navItems = [
    {
      label: "Teams",
      icon: faShield,
      action: () => router.push("/"),
      pathname: "/",
    },
    {
      label: "Career",
      icon: faChartColumn,
      action: () => router.push("/career"),
      pathname: "/career",
    },
    {
      label: "Logout",
      icon: faSignOutAlt,
      action: logout,
      pathname: "/logout",
    },
  ];

  const pathname = router.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-around items-center h-20 shadow-lg">
      <div
        className={`w-full  p-2 flex flex-col items-center cursor-pointer transition duration-200 ease-in-out ${
          pathname === "/profile"
            ? "border-green-500 border-2 text-green-500"
            : ""
        }`}
        onClick={() => router.push("/profile")}
      >
        <img
          src={`${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
          }/files/${user?.photoUrl || "user-picture-default.avif"}`}
          alt="User Photo"
          className="w-9 h-9 rounded-full"
        />
        <span className="text-sm">Profile</span>
      </div>
      {navItems.map((item, index) => (
        <div
          key={index}
          className={`w-full p-2 flex flex-col items-center space-y-1 cursor-pointer transition duration-200 ease-in-out ${
            pathname === item.pathname
              ? "border-green-500 border-2 text-green-500"
              : ""
          }`}
          onClick={item.action}
        >
          {/* @ts-ignore */}
          <FontAwesomeIcon icon={item.icon} size="2x" />
          <span className="text-sm">{item.label}</span>
        </div>
      ))}
    </nav>
  );
};

export default BottomNavBar;
