import { Link } from "wouter";
import { MdDashboard, MdHome } from "react-icons/md";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-4">
            <Link href="/">
              <a className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/" ? "text-primary" : "text-muted-foreground"
              )}>
                <MdHome className="h-5 w-5" />
                Home
              </a>
            </Link>
            <Link href="/dashboard">
              <a className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
              )}>
                <MdDashboard className="h-5 w-5" />
                Dashboard
              </a>
            </Link>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}