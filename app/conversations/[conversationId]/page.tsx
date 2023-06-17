import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";

interface Params {
  conversationId: string;
}

const ConversationId = async ({ params }: { params: Params }) => {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);

  if (!conversation) {
    return (
      <div className="pl-80 h-full">
        <div className="flex flex-col h-full">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="flex flex-col h-full">
        <Header conversation={conversation} />
      </div>
    </div>
  );
};

export default ConversationId;