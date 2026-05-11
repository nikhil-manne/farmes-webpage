import { BottomNav } from "./BottomNav";
import { SideNav } from "./SideNav";
import { ProcessFlowModal } from "../home/ProcessFlowModal";
import { useProcessModal } from "@/store/processModal";

export const MobileShell = ({ children }: { children: ReactNode }) => {
  const { isOpen, close } = useProcessModal();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[720px] flex-col bg-background lg:hidden">
        <main className="flex-1 pb-24">{children}</main>
        <BottomNav />
      </div>

      <div className="hidden lg:flex lg:min-h-screen">
        <SideNav />
        <main className="flex-1 bg-background">
          <div className="mx-auto w-full max-w-[1180px] px-8">{children}</div>
        </main>
      </div>

      <ProcessFlowModal isOpen={isOpen} onClose={close} />
    </div>
  );
};
