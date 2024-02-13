import Sidebar from "@/app/components/sidebar/Sidebar";

const UsersLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <Sidebar>
      <div className="h-full">
        {children}
      </div>
    </Sidebar>
  )
}

export default UsersLayout;
