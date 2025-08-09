import { NavLink, Link } from "react-router-dom";
import MetallicCircle from "@/components/MetallicCircle";

const Header = () => {
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Predictions", path: "/predictions" },
    { label: "Markets", path: "/markets" },
    { label: "Analyze", path: "/analyze" },
    { label: "News", path: "/news" },
  ];

  return (
    <header className="sticky top-4 z-50 flex items-center mx-4 lg:mx-8">
      {/* Coincast Logo */}
      <Link
        to="/"
        aria-label="Go to homepage"
        className="absolute left-4 lg:left-8 flex items-center gap-2 group select-none cursor-pointer z-10"
      >
        <MetallicCircle size={34} className="drop-shadow-[0_0_6px_rgba(255,255,255,0.35)] transition-transform duration-300 group-hover:scale-[1.03]" />
        <div className="coincast-logo transition-opacity duration-300 group-hover:opacity-90">Coincast</div>
      </Link>

      {/* Navigation Pill - Centered */}
      <nav className="bg-white/10 backdrop-blur-md border border-white/20 
                     hover:bg-white/20 hover:border-white/30 
                     transition-all duration-500 rounded-full 
                     shadow-2xl shadow-black/25
                     px-6 py-3 mx-auto">
        <div className="flex items-center space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  isActive 
                    ? "bg-white/20 text-white glow-white" 
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;