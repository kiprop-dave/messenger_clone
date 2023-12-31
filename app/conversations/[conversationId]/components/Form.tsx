"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { HiPhoto, HiPaperAirplane } from "react-icons/hi2";
import { CldUploadButton } from "next-cloudinary";
import useConverstion from "@/app/hooks/useConversation";
import MessageInput from "./MessageInput";

export default function Form(): JSX.Element {
  const { conversationId } = useConverstion();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios
      .post("/api/messages", { ...data, conversationId })
      .catch(() => toast.error("Error sending message"));
  };

  const handleImageUpload = (result: any) => {
    // Library doesn't provide types
    axios.post("/api/messages", {
      image: result?.info?.secure_url,
      conversationId,
    });
  };

  return (
    <div className="flex items-center bg-white gap-2 border-t lg:gap-4 w-full p-4">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleImageUpload}
        uploadPreset="qfbtmcvf"
      >
        <HiPhoto size={30} className="text-sky-500 cursor-pointer hover:text-sky-600" />
      </CldUploadButton>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 lg:gap-4 w-full">
        <MessageInput
          placeholder="Type a message"
          id="message"
          type="text"
          register={register}
          errors={errors}
          required
        />
        <button
          className="rounded-md cursor-pointer bg-sky-500 hover:bg-sky-600 p-2 transition"
          type="submit"
        >
          <HiPaperAirplane size={20} className="text-white" />
        </button>
      </form>
    </div>
  );
}
