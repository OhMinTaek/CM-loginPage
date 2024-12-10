import TabBar from "@/components/tab-bar";
import { getUserInfoBySession } from "@/service/userService";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserInfoBySession();
  return (
    <div>
      <div>{children}</div>
      <TabBar username={user.username} />
    </div>
  );
}