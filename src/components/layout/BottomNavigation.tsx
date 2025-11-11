import { Home, ShoppingBag, TestTube, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: ShoppingBag, label: "Shop", path: "/shop" },
  { icon: TestTube, label: "Tests", path: "/tests" },
  { icon: HelpCircle, label: "FAQ", path: "/faq" },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto px-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200",
                "hover:bg-muted/50 rounded-lg",
                isActive && "text-primary"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-all duration-200",
                  isActive && "scale-110"
                )}
              />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
