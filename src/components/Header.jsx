import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { Badge } from "./ui/badge";
import { Film, Search, Clock, CheckCircle2 } from "lucide-react";

const Header = () => {
  const { watchList, watched } = useContext(GlobalContext);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    {
      path: "/",
      label: "Home",
      icon: Film,
    },
    {
      path: "/search",
      label: "Add More",
      icon: Search,
    },
    {
      path: "/watchlist",
      label: "Watchlist",
      icon: Clock,
      badge: watchList.length,
    },
    {
      path: "/watched",
      label: "Watched",
      icon: CheckCircle2,
      badge: watched.length,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-8">
        <Link to="/" className="flex items-center space-x-2 group">
          <Film className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
          <span className="hidden font-bold text-xl sm:inline-block bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            PickFlixx
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline-block">{link.label}</span>
                {link.badge > 0 && (
                  <Badge
                    variant={active ? "secondary" : "outline"}
                    className="ml-1 px-1.5 py-0.5 text-xs"
                  >
                    {link.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
