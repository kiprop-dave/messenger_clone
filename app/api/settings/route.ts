import prisma from "@/app/libs/prismaDb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) return new NextResponse("Unauthorized", { status: 401 });

    const body = await request.json();
    const { image, name } = body;
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        image: image,
        name: name
      }
    })

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error, "user update error /api/settings/route.ts")
    return new NextResponse("Internal server error", { status: 500 })
  }
}
