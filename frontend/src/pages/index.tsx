import CreateRoomPage from "@/components/CreateRoomPage";
import Layout from "@/components/Layout";
import { SessionProvider } from "next-auth/react";

export default function IndexPage() {
  return (
    <SessionProvider>
      <Layout>
        <CreateRoomPage />
      </Layout>
    </SessionProvider>
  );
}
