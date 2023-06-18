import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismaDb";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface Params {
  conversationId: string;
}

export async function POST(req: Request, { params }: { params: Params }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { conversationId } = params;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    if (!conversation) {
      return new NextResponse("INVALID_CONVERSATION_ID", { status: 400 });
    }

    const lastMessage = conversation.messages.at(-1);

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    if (lastMessage.seen.some((seen) => seen.id === currentUser.id)) {
      return NextResponse.json(conversation);
    }

    // Update the seen of the last message

    const updatedLastMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    return new NextResponse("success");
  } catch (error) {
    console.error("Error in POST /api/conversations/[conversationId]/seen", error);
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
}
