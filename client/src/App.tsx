import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";

// Public Pages
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

// Job Seeker Pages
import JobSeekerDashboard from "@/pages/job-seeker/dashboard";
import RoleExplorer from "@/pages/job-seeker/role-explorer";
import SkillInsights from "@/pages/job-seeker/skill-insights";
import SalaryExplorer from "@/pages/job-seeker/salary-explorer";
import LocationInsights from "@/pages/job-seeker/location-insights";

// HR Pages
import HRDashboard from "@/pages/hr/dashboard";
import MarketTrends from "@/pages/hr/market-trends";
import SalaryBenchmark from "@/pages/hr/salary-benchmark";
import SkillGapAnalysis from "@/pages/hr/skill-gap-analysis";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Job Seeker Routes */}
      <ProtectedRoute path="/dashboard" component={JobSeekerDashboard} roles={["job_seeker", "hr"]} />
      <ProtectedRoute path="/roles" component={RoleExplorer} roles={["job_seeker", "hr"]} />
      <ProtectedRoute path="/skills" component={SkillInsights} roles={["job_seeker", "hr"]} />
      <ProtectedRoute path="/salary" component={SalaryExplorer} roles={["job_seeker", "hr"]} />
      <ProtectedRoute path="/locations" component={LocationInsights} roles={["job_seeker", "hr"]} />
      
      {/* HR Only Routes */}
      <ProtectedRoute path="/hr/dashboard" component={HRDashboard} roles={["hr"]} />
      <ProtectedRoute path="/hr/trends" component={MarketTrends} roles={["hr"]} />
      <ProtectedRoute path="/hr/benchmark" component={SalaryBenchmark} roles={["hr"]} />
      <ProtectedRoute path="/hr/skills-gap" component={SkillGapAnalysis} roles={["hr"]} />
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <AuthProvider>
        <Router />
      </AuthProvider>
      <Toaster />
    </>
  );
}

export default App;
