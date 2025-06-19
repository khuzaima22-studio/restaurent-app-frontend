import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
  ];

  return (
    <nav className="bg-white shadow-sm fixed top-0 w-full z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="text-2xl font-extrabold text-[#ff5722] tracking-wide logo">
          STEAKZ
        </div>
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <FaTimes className="text-2xl text-[#ff5722]" />
            ) : (
              <FaBars className="text-2xl text-[#ff5722]" />
            )}
          </button>
        </div>
        <ul
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full bg-white md:bg-transparent md:flex md:items-center md:space-x-8 md:static md:w-auto text-sm font-medium`}
        >
          {links.map((item, index) => (
            <li
              key={index}
              className="py-1  border-b md:border-none text-center hover:bg-[#ff5722] hover:text-white hover:rounded transition "
            >
              <Link to={item.path} className="block px-4">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
