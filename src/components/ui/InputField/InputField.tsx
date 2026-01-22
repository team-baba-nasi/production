"use client";

import styles from "@/components/ui/InputField/InputField.module.scss";
import Image from "next/image";
import Label from "@/components/ui/Label/Label";
import clsx from "clsx";
import { useRef } from "react";

type InputFieldProps = {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    search?: boolean;
    reset?: boolean;
    space?: boolean;
    edit?: boolean;
    className?: string;
};

const InputField: React.FC<InputFieldProps> = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    search,
    reset,
    space,
    edit,
    className,
}) => {
    const Input = useRef<HTMLInputElement>(null);

    const handleReset = () => {
        onChange("");
        Input.current?.focus();
    };

    return (
        <div className={clsx(styles.wrap, space && "px-[16px]", className)}>
            {label && <Label label={label} />}
            {edit ? (
                <div className={styles.fieldWrap}>
                    <>
                        {search && (
                            <Image
                                src="/images/ui/search.svg"
                                alt="search"
                                width={18}
                                height={18}
                                className={styles.search}
                            />
                        )}

                        <input
                            type={type}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            ref={Input}
                        />

                        {reset && value !== "" && (
                            <button onClick={handleReset} className={styles.close_btn}>
                                <Image
                                    src="/images/ui/close_small.svg"
                                    alt="入力リセットボタン"
                                    width={20}
                                    height={20}
                                />
                            </button>
                        )}
                    </>
                </div>
            ) : (
                <>
                    <p className={clsx("text_normal py-[5px]")}>{value}</p>
                </>
            )}
        </div>
    );
};

export default InputField;
