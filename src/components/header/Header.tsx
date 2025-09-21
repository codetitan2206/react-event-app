import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Menu, X, CalendarIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { Button } from "../Button";

const navItems = [
  { to: "/", label: "All Events", icon: CalendarIcon },
  { to: "/my-events", label: "Attending", icon: UserIcon },
];

export function Header() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    closeMobileMenu();
  };

  const getNavLinkClass = (isActive: boolean, isMobile: boolean) =>
    clsx(
      "flex items-center text-sm transition-colors",
      isActive
        ? "text-blue-600 font-medium"
        : "text-gray-600 hover:text-gray-900",
      isMobile && "py-2 rounded-md"
    );

  const NavigationLinks = ({ isMobile = false }) => (
    <>
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={isMobile ? closeMobileMenu : undefined}
          className={({ isActive }) => getNavLinkClass(isActive, isMobile)}
        >
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </>
  );

  const AuthButtons = ({ isMobile = false }) => {
    const baseButtonClass = clsx(
      "text-sm font-medium transition-colors rounded-md",
      isMobile ? "px-3 py-2 mb-4" : "px-4 py-2"
    );

    if (isAuthenticated) {
      return (
        <Button variant="secondary" size="small" onClick={handleLogout}>
          Logout
        </Button>
      );
    }

    return (
      <>
        <Link
          to="/login"
          onClick={isMobile ? closeMobileMenu : undefined}
          className={clsx(
            baseButtonClass,
            "bg-blue-600 text-white hover:bg-blue-700",
            { "block text-center": isMobile }
          )}
        >
          Login
        </Link>
        <Link
          to="/register"
          onClick={isMobile ? closeMobileMenu : undefined}
          className={clsx(
            baseButtonClass,
            "border border-gray-300 text-gray-700 hover:bg-gray-50",
            { "block text-center": isMobile }
          )}
        >
          Register
        </Link>
      </>
    );
  };

  return (
    <header className="relative bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex flex-shrink-0 flex-col">
            <h1 className="text-lg font-bold text-gray-800">
              Event Management System
            </h1>
            <p className="text-xs text-gray-500">Made with React & Go ❤️</p>
          </Link>
          <nav className="hidden items-center space-x-8 md:flex">
            {isAuthenticated && (
              <div className="flex items-center gap-6">
                <NavigationLinks />
              </div>
            )}
            <div className="flex items-center space-x-3">
              <AuthButtons />
            </div>
          </nav>
          <div className="md:hidden">
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="secondary"
              icon={
                isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )
              }
            ></Button>
          </div>
        </div>
        <div
          className={clsx(
            "transition-all duration-300 ease-in-out md:hidden",
            isMobileMenuOpen ? "max-h-96 pb-4 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav className="border-t border-gray-200 pt-4">
            {isAuthenticated && (
              <div className="mb-4 space-y-3">
                <NavigationLinks isMobile />
              </div>
            )}

            <AuthButtons isMobile />
          </nav>
        </div>
      </div>
    </header>
  );
}
