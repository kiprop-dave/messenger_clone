import prisma from "@/app/libs/prismaDb";
import getSession from "./getSession";

const getCurentUser = async () => {
  try {
    const session = await getSession();

    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return null;

    return user;
  } catch (error) {
    return null;
  }
};

export default getCurentUser;
