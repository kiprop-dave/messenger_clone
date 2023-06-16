import getCurentUser from "./getCurrentUser";
import prisma from "@/app/libs/prismaDb";

const getConversations = async () => {
  const currentUser = await getCurentUser();

  if (!currentUser?.id) return [];

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
            sender: true,
          },
        },
      },
    });

    return conversations;
  } catch (error) {
    return [];
  }
};

export default getConversations;
