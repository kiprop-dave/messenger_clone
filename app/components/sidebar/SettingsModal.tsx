'use client';

import axios from "axios";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useState } from "react";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary"
import { toast } from "react-hot-toast";
import { User } from "@prisma/client";
import Modal from "../modals/Modal";
import Input from "../inputs/Input";
import Button from "../Button";

interface SettingsModalProps {
  onClose: () => void
  isOpen?: boolean
  currentUser: User
}

export default function SettingsModal({ onClose, isOpen, currentUser }: SettingsModalProps): JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image
    }
  });

  const image = watch('image');
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios.post('/api/settings', data).then(() => {
      router.refresh();
      onClose();
    }).catch(() => toast.error('something went wrong')).finally(() => setIsLoading(false));
  }

  const handleUpload = (result: any) => {
    setValue('image', result?.info?.secure_url, { shouldValidate: true })
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your public information
            </p>
            <div>
              <Input disabled={isLoading} label="Name" id="name" errors={errors} register={register} required />
              <div>
                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">Photo</label>
                <div className="mt-2 flex items-center gap-x-3">
                  <Image
                    width="48"
                    height="48"
                    className="rounded-full"
                    src={image || currentUser?.image || '/images/placeholder.jpg'}
                    alt="Avatar"
                  />
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset="qfbtmcvf"
                  >
                    <Button
                      disabled={isLoading}
                      secondary
                      type="button"
                    >
                      Change
                    </Button>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button disabled={isLoading} secondary onClick={onClose}>Cancel</Button>
          <Button disabled={isLoading} type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  )
}
