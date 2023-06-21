'use client';

import Modal from "@/app/components/modals/Modal";
import Image from "next/image";

interface ImageModalProps {
  isOpen?: boolean
  onClose: () => void
  src?: string
}

export default function ImageModal({ isOpen, onClose, src }: ImageModalProps): JSX.Element | null {
  if (!src) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-80 h-80">
        <Image src={src} alt="sent image" fill className="object-cover" />
      </div>
    </Modal>
  )
}
