"use client";

import { useEffect, useState } from "react";
import styles from "./LoadingDialog.module.scss";

interface LoadingDialogProps {
    isOpen: boolean;
    message?: string;
}

export default function LoadingDialog({ isOpen, message = "読み込み中..." }: LoadingDialogProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div className={`${styles.overlay} ${isOpen ? styles.fadeIn : styles.fadeOut}`}>
            <div className={`${styles.dialog} ${isOpen ? styles.scaleIn : styles.scaleOut}`}>
                <div className={styles.spinner}>
                    <div className={styles.bounce1}></div>
                    <div className={styles.bounce2}></div>
                    <div className={styles.bounce3}></div>
                </div>
                <p className={styles.message}>{message}</p>
            </div>
        </div>
    );
}