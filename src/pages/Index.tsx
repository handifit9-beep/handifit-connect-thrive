import { Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";

const Index = () => {
  const onboarded = typeof window !== "undefined" && localStorage.getItem("handifit:onboarded");
  if (!onboarded) return <Navigate to="/onboarding" replace />;
  return <Dashboard />;
};

export default Index;
