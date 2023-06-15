import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import getCurentUser from "@/app/actions/getCurrentUser";

export default async function Sidebar({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurentUser();

  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
}
