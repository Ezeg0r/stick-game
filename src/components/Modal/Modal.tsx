import React, { useEffect } from "react";

type ModalProps = {
    isOpen: boolean;
    onClose?: () => void;
    title?: string;
    children?: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose?.();
        };
        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-2xl p-6 shadow-xl w-full max-w-lg mx-4 transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
                    aria-label="Закрыть"
                >
                    &times;
                </button>

                {title && (
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
                )}

                <div>{children}</div>

            </div>
        </div>
    );
};

export default Modal;
