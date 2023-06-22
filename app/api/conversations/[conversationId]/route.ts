import prisma from "@/app/libs/prismaDb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { pusherServer } from "@/app/libs/pusher";

interface Params {
  conversationId: string
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id) return NextResponse.json(null);

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true
      }
    });
    if (!existingConversation) return new NextResponse("INVALID_ID", { status: 400 });

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id]
        }
      }
    })

    // delete conversation
    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:delete", existingConversation);
      }
    })
    return NextResponse.json(deletedConversation);
  } catch (error) {
    console.error(error, "ERROR IN api/conversations/conversationId delete")
  }
}
