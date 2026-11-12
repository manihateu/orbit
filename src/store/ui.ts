import { create } from "zustand";

export type ToastVariant = "success" | "info" | "error";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface UiState {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id" | "variant"> & { variant?: ToastVariant }) => void;
  dismiss: (id: string) => void;
}

export const useUi = create<UiState>((set, get) => ({
  toasts: [],
  toast: ({ title, description, variant = "success" }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set({ toasts: [...get().toasts, { id, title, description, variant }] });
    window.setTimeout(() => {
      if (get().toasts.some((item) => item.id === id)) {
        set({ toasts: get().toasts.filter((item) => item.id !== id) });
      }
    }, 4600);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((item) => item.id !== id) }),
}));
