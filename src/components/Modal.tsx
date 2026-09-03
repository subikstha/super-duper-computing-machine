import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
    children: React.ReactNode;
};

const Modal = ({ children }: ModalProps) => {
    const elRef = useRef<HTMLDivElement | null>(null);

    if (!elRef.current) {
        elRef.current = document.createElement("div");
    }

    useEffect(() => {
        const modalRoot = document.getElementById("modal");

        if (!modalRoot || !elRef.current) {
            return;
        }

        modalRoot.appendChild(elRef.current);

        return () => {
            modalRoot.removeChild(elRef.current!);
        };
    }, []);

    return createPortal(
        <><div className="backdrop"></div><div>{children} </div></>,
        elRef.current
    );
};

export default Modal;