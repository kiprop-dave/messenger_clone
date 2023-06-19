"use client";

import { Conversation, User } from "@prisma/client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useMemo } from "react";
import { IoClose, IoTrash } from "react-icons/io5";
import format from "date-fns/format";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation & {
    users: User[];
  };
}

export default function ProfileDrawer(props: ProfileDrawerProps): JSX.Element {
  const { isOpen, onClose, conversation } = props;
  const otherUser = useOtherUser(conversation);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const isActive = true; // Implement active status checking functionality

  const joinedAt = useMemo(() => {
    if (conversation?.isGroup) return format(new Date(conversation.createdAt), "dd/MM/yyyy");

    return format(new Date(otherUser.createdAt), "dd/MM/yyyy");
  }, [otherUser.createdAt, conversation.createdAt, conversation?.isGroup]);

  const title = useMemo(() => {
    return conversation.name || otherUser.name;
  }, [conversation.name, otherUser.name]);

  const statusText = useMemo(() => {
    if (conversation?.isGroup) return `${conversation.users.length} members`;

    return isActive ? "Online" : "Offline";
  }, [conversation, isActive]);
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-neutral-900 bg-opacity-50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <section className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="h-full flex flex-col overflow-y-scroll bg-white rounded-xl py-6">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-end">
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <IoClose size={24} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className="flex flex-col items-center">
                        <div className="mb-2">
                          <Avatar user={otherUser} />
                        </div>
                        <div>{title}</div>
                        <div className="text-sm text-gray-500">{statusText}</div>
                        <div className="flex gap-10 my-8">
                          <div
                            onClick={() => setConfirmDelete(true)}
                            className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75"
                          >
                            <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                              <IoTrash size={20} />
                            </div>
                            <div className="text-sm font-light text-neutral-600">Delete</div>
                          </div>
                        </div>
                        <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                          <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                            {conversation.isGroup && (
                              <div>
                                <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                  Emails
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                  {conversation.users.map((user) => user.email).join(", ")}
                                </dd>
                              </div>
                            )}
                            {!conversation.isGroup && (
                              <div>
                                <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                  Email
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                  {otherUser.email}
                                </dd>
                              </div>
                            )}
                            {!conversation.isGroup && (
                              <>
                                <hr />
                                <div>
                                  <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                    Joined
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                    <time dateTime={joinedAt}>{joinedAt}</time>
                                  </dd>
                                </div>
                              </>
                            )}
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </section>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
