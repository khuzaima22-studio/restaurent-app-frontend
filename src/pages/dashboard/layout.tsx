import { NavLink, Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { IsToken } from "../../helper/isToken";
import { TbBuildingCastle, TbLayoutDashboardFilled, TbLogout2, TbUsersGroup } from "react-icons/tb";
import { FaUserCircle } from "react-icons/fa";

export default function Layout() {
  const router = useNavigate();

  const logout = () => {
    ["token", "username", "role", "fullname", "id"].forEach((key) =>
      localStorage.removeItem(key)
    );
    router("/login");
  };

  useEffect(() => {
    if (!IsToken()) {
      router("/login");
    }
  }, []);

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <TbLayoutDashboardFilled className="mr-3" />,
    },
    {
      path: "user",
      label: "Users",
      icon: <TbUsersGroup className="mr-3" />,
    },
    {
      path: "branch",
      label: "Branches",
      icon: <TbBuildingCastle className="mr-3" />,
    },
  ];
  
  const [user] = useState({
      id: localStorage.getItem("id") || "",
      fullName: localStorage.getItem("fullname") || "",
      userName: localStorage.getItem("username") || "",
      role: localStorage.getItem("role") || "",
    });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-orange-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <span className="text-2xl font-extrabold text-[#ff5722] logo">
              STEAKZ
            </span>

            <nav className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `text-sm font-medium px-4 py-2 rounded-md transition ${
                      isActive
                        ? "bg-[#ffe4d8] text-[#ff5722] font-semibold"
                        : "text-gray-700 hover:bg-[#fff1ea]"
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </div>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FaUserCircle className="text-xl text-[#ff5722]" />
              <div className="text-right leading-tight capitalize">
                <div className="font-semibold">{user.fullName}</div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 bg-[#ff5722] hover:bg-orange-700 text-white text-sm font-semibold py-2 px-4 rounded-md transition"
            >
              <TbLogout2 size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow p-6 md:p-10 bg-white shadow-inner">
        <Outlet />
      </main>
    </div>
  );
}
