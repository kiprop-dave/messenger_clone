import getUsers from "../actions/getUsers";
import getConversations from "../actions/getConversations";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

export default async function ConversatioLayout({ children }: { children: React.ReactNode }) {
  const users = await getUsers();
  const conversations = await getConversations();

  return (
    <Sidebar>
      <ConversationList users={users} initialConvs={conversations} />
      <div className="h-full">{children}</div>
    </Sidebar>
  );
}
