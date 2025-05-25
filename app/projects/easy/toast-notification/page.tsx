'use client';

import {Button, Card} from "@/components/ui";
import {useCallback, useEffect, useMemo, useState} from "react";
import {FaRegCheckCircle} from "react-icons/fa";
import {FiAlertCircle, FiAlertTriangle } from "react-icons/fi";
import {IoMdClose} from "react-icons/io";

// Упрощенный тип для видов уведомлений
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Объединенная конфигурация для всех типов уведомлений
const TOAST_CONFIG = {
    types: {
        success: {
            icon: <FaRegCheckCircle/>,
            text: 'Success: This is a success toast.',
            color: 'rgb(10, 191, 48)',
            type: 'default',
        },
        error: {
            icon: <IoMdClose/>,
            text: 'Error: This is an error toast.',
            color: 'rgb(226, 77, 76)',
            type: 'destructive',
        },
        warning: {
            icon: <FiAlertTriangle/>,
            text: 'Warning: This is a warning toast.',
            color: 'rgb(233, 189, 12)',
            type: 'secondary',
        },
        info: {
            icon: <FiAlertCircle/>,
            text: 'Info: This is an information toast.',
            color: 'rgb(52, 152, 219)',
            type: 'outline',
        },
    },
    time: 5000,
};

// Упрощенный тип для элемента уведомления
type ToastItem = {
    id: number;
    type: ToastType;
}

type ToastProps = {
    type: ToastType;
    onClose: () => void;
}

const Toast = ({ type, onClose }: ToastProps) => {
    const { icon, text, color } = TOAST_CONFIG.types[type];

    useEffect(() => {
        const timer = setTimeout(onClose, TOAST_CONFIG.time);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <li
            className={`flex toast ${type} 0 shadow-md rounded-lg p-3 dark:bg-accent`}>
            <div className="text-2xl mr-3" style={{ color }}>{icon}</div>
            <span className="flex-grow">{text}</span>
            <button onClick={onClose}>
                <IoMdClose />
            </button>
        </li>
    );
}

const ToastNotificationPage = () => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToast = useCallback((type: ToastType) => {
        setToasts((prevToasts) => [...prevToasts, { id: Date.now(), type }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    const toastButtons = useMemo(() =>
            Object.entries(TOAST_CONFIG.types).map(([key, value]) => (
                <Button variant={value.type} key={key} onClick={() => addToast(key as ToastType)}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                </Button>
            )),
        [addToast]);

    return (
        <Card className="t-notifications max-w-sm w-full mx-auto p-4 rounded">
            <ul>
                {toasts.map(({ id, type }) => (
                    <Toast key={id} type={type} onClose={() => removeToast(id)} />
                ))}
            </ul>
            <div className="grid gap-2 sm:grid-cols-4">
                {toastButtons}
            </div>
        </Card>
    );
};

export default ToastNotificationPage;