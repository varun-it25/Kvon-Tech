import { useNavigate } from "react-router-dom";
import { Layers, LayoutDashboard, LogOut } from "lucide-react";
import { useCookies } from "react-cookie";
import React from "react";

interface SidebarProps {
  route: "dashboard" | "tasks" | "settings";
}

const Sidebar: React.FC<SidebarProps> = ({ route }) => {
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["session"]);

  const logoutHandler = () => {
    removeCookie("session");
    navigate("/login");
  };

  const navItem = (
    label: string,
    path: string,
    icon: React.ReactNode,
    active: boolean
  ) => (
    <div
      onClick={() => navigate(path)}
      className={`flex px-6 py-3 space-x-2.5 cursor-pointer ${
        active
          ? "text-black bg-gradient-to-r from-orange-100 to-white"
          : "text-zinc-800 hover:text-zinc-500"
      } text-sm font-medium items-center`}
    >
      {icon}
      <p>{label}</p>
    </div>
  );

  return (
    <div className="hidden md:flex md:w-[15rem] lg:w-[16rem] flex-col py-4 justify-between">
      <div className="px-6 py-3 pb-2">
        <p className="font-bold text-center ml-[-1.6rem] text-sky-600 text-2xl">Taskify</p>
      </div>

      <div className="flex-1 py-4 space-y-4">
        {navItem("Dashboard", "/dashboard", <LayoutDashboard size={20} />, route === "dashboard")}
        {navItem("Tasks", "/tasks", <Layers size={20} />, route === "tasks")}
        {navItem("Settings", "/settings", <Layers size={20} />, route === "settings")}
      </div>

      <div className="py-4">
        <div
          className="flex py-4 text-zinc-800 justify-center space-x-2.5 cursor-pointer hover:text-red-500 text-sm font-medium items-center"
          onClick={logoutHandler}
        >
          <p className="ml-[-1rem]">Logout</p>
          <LogOut size={20} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;