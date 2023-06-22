import { useState, useEffect } from "react";
import useActiveList from "./useActiveList";
import { pusherClient } from "../libs/pusher";
import { Channel, Members } from "pusher-js";

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe("presence-monitor");
      setActiveChannel(channel);
    }

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];

      members.each((user: Record<string, any>) => initialMembers.push(user.id));
      set(initialMembers);
    });

    channel.bind("pusher:member_added", (user: Record<string, any>) => {
      add(user.id);
    });

    channel.bind("pusher:member_removed", (user: Record<string, any>) => {
      remove(user.id);
    });

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-monitor");
        setActiveChannel(null);
      }
    }
  }, [activeChannel, set, add, remove]);
};

export default useActiveChannel;
