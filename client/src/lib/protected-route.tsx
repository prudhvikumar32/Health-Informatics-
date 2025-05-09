import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
  roles = []
}: {
  path: string;
  component: React.ComponentType<any>;
  roles?: string[];
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Check role-based access if roles are specified
  if (roles.length > 0 && !roles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    return (
      <Route path={path}>
        {user.role === "job_seeker" ? (
          <Redirect to="/dashboard" />
        ) : (
          <Redirect to="/hr/dashboard" />
        )}
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
