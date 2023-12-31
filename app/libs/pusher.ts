import PusherServer from "pusher";
import PusherClient from "pusher-js";


export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: "ap2",
  useTLS: true
});

export const pusherClient = new PusherClient(
  "6f00e6b1b4ecb41cc841",
  {
    channelAuthorization: {
      endpoint: "/api/pusher/auth",
      transport: "ajax"
    },
    cluster: "ap2"
  }
)
