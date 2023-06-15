import bcrypt from "bcrypt";
import prismaDb from "@/app/libs/prismaDb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse("Missing credentials", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaDb.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return new NextResponse("error", { status: 500 });
  }
}
