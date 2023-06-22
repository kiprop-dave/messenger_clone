import prisma from "@/app/libs/prismaDb";
import getCurentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { message, conversationId, image } = body;

    const newMesssage = await prisma.message.create({
      include: {
        seen: true,
        sender: true,
      },
      data: {
        body: message,
        image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMesssage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    await pusherServer.trigger(conversationId, "messages:new", newMesssage);

    const lastMessageSent = updatedConversation.messages.at(-1)!;

    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, "conversation:updated", {
        id: conversationId,
        messages: [lastMessageSent]
      });
    })
    return NextResponse.json(newMesssage);
  } catch (error) {
    console.log(error, "error in /api/messages/route.ts");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
