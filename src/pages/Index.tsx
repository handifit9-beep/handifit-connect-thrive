import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import Dashboard from "./Dashboard";

const Index = () => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-dvh grid place-items-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  if (!user) return <Navigate to="/auth" replace />;
  const onboarded = typeof window !== "undefined" && localStorage.getItem("handifit:onboarded");
  if (!onboarded) return <Navigate to="/onboarding" replace />;
  return <Dashboard />;
};

export default Index;
