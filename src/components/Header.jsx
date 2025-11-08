import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Film,
  Search,
  Clock,
  CheckCircle2,
  BarChart3,
  FolderHeart,
  Compass,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";

const Header = () => {
  const { watchList, watched, collections } = useContext(GlobalContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const collectionsCount = Object.keys(collections || {}).length;

  const navLinks = [
    {
      path: "/",
      label: "Latest",
      icon: TrendingUp,
    },
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: Film,
    },
    {
      path: "/search",
      label: "Search",
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
    {
      path: "/collections",
      label: "Collections",
      icon: FolderHeart,
      badge: collectionsCount,
    },
    {
      path: "/recommendations",
      label: "Recommend",
      icon: Compass,
    },
    {
      path: "/statistics",
      label: "Stats",
      icon: BarChart3,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-8">
        <Link to="/dashboard" className="flex items-center space-x-2 group">
          <div className="rounded-lg bg-gradient-to-br from-primary to-blue-600 p-1.5 transition-transform group-hover:scale-110">
            <Film className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            PickFlixx
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
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

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white/95 backdrop-blur-md shadow-lg">
          <nav className="container flex flex-col gap-1 p-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                  {link.badge > 0 && (
                    <Badge
                      variant={active ? "secondary" : "outline"}
                      className="ml-auto px-1.5 py-0.5 text-xs"
                    >
                      {link.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
