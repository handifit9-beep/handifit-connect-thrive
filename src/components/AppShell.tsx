import { ReactNode } from "react";
import BottomNav from "./BottomNav";

interface AppShellProps {
  children: ReactNode;
  hideNav?: boolean;
}

const AppShell = ({ children, hideNav }: AppShellProps) => {
  return (
    <div className="min-h-dvh w-full flex justify-center bg-background">
      <div className="relative w-full max-w-md md:max-w-2xl lg:max-w-5xl xl:max-w-6xl min-h-dvh flex flex-col">
        <main className={`flex-1 ${hideNav ? "pb-6" : "pb-28 md:pb-32"}`}>{children}</main>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
};

export default AppShell;
