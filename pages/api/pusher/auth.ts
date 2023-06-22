import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { pusherServer } from "@/app/libs/pusher";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
