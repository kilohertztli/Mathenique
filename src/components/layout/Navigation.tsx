import { Link, useLocation } from "react-router-dom";
import { BookOpen, Swords, Flag, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { path: "/lessons", label: "Adventure", icon: Flag },
  { path: "/play", label: "Arena", icon: Swords },
  { path: "/progress", label: "Progress", icon: BookOpen },
];

export function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto z-50">
      <div className="bg-card border-t md:border-b md:border-t-0 border-primary/20 card-shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - Hidden on mobile */}
            <Link to="/" className="hidden md:flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-fredoka font-bold text-xl">M</span>
              </div>
              <span className="font-fredoka font-bold text-xl text-foreground">Mathenique</span>
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center justify-around md:justify-center gap-2 md:gap-8 flex-1 md:flex-none">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-xs md:text-base font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Menu - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-5 h-5" />
                <span className="font-medium">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
