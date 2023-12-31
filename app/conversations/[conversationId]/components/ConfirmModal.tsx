"use client";

import { useCallback, useState } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import useConverstion from "@/app/hooks/useConversation";
import Modal from "@/app/components/modals/Modal";
import { FiAlertTriangle } from "react-icons/fi";
import Button from "@/app/components/Button";
import axios from "axios";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfirmModal({ isOpen, onClose }: ConfirmModalProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { conversationId } = useConverstion();
  const router = useRouter();
  const onDelete = useCallback(() => {
    setIsLoading(true);

    axios.delete(`/api/conversations/${conversationId}`).then(() => {
      onClose();
      router.push("/conversations");
      router.refresh();
    }).catch(() => toast.error("something went wrong")).finally(() => setIsLoading(false))
  }, [router, conversationId, onClose]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <FiAlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
              Delete conversation
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this conversation? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="my-5 sm:my-4 flex items-center justify-evenly">
          <Button type="button" disabled={isLoading} danger onClick={onDelete}>
            Delete
          </Button>
          <Button disabled={isLoading} secondary onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
