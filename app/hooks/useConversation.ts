import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConverstion = () => {
  const params = useParams();

  const converstionId = useMemo(() => {
    if (!params?.conversationId) return "";

    return params.conversationId as string;
  }, [params?.conversationId]);

  const isOpen = useMemo(() => !!converstionId, [converstionId]);

  return useMemo(
    () => ({
      isOpen,
      converstionId,
    }),
    [converstionId, isOpen]
  );
};

export default useConverstion;
