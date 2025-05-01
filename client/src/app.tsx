import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import OtpVerificationPage from "@/pages/otp-verification";
import ForgotPasswordPage from "@/pages/forgot-password";
import ForgotUsernamePage from "@/pages/forgot-username";
import ResetPasswordPage from "@/pages/reset-password";
import DisRpt from "@/pages/dis-rpt";
import EpoxyPage from "@/pages/epoxy";
import EColPage from "@/pages/ecol";
import GrindPage from "@/pages/grind";
import PolishPage from "@/pages/polish";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/dis-rpt" component={DisRpt} />
      <ProtectedRoute path="/epoxy" component={EpoxyPage} />
      <ProtectedRoute path="/ecol" component={EColPage} />
      <ProtectedRoute path="/grind" component={GrindPage} />
      <ProtectedRoute path="/polish" component={PolishPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/verify-otp" component={OtpVerificationPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/forgot-username" component={ForgotUsernamePage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
