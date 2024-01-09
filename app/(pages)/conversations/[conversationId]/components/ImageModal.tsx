import Modal from "@/app/components/Modal";
import Image from "next/image";
import React from "react";

interface ImageModalProps {
    src: string;
    isOpen?: boolean;
    onClose: () => void;
}

export default function ImageModal({ src, isOpen, onClose }: ImageModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="h-[80vh]">
                <Image
                    src={src}
                    alt="image"
                    className="object-cover"
                    sizes="100%"
                    fill
                />
            </div>
        </Modal>
    );
}
