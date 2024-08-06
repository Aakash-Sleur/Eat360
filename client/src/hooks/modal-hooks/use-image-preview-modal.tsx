import { create } from "zustand";

interface ImagePreviewStore {
    isOpen: boolean;
    data: string;
    updateModalData: (newData: { data: string }) => void;
    onOpen: () => void;
    onClose: () => void;
}

const useImagePreviewModal = create<ImagePreviewStore>((set) => ({
    isOpen: false,
    data: "",
    updateModalData: (newData) => set((state) => ({ ...state, ...newData })),
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false, data: "" }),
}));


export default useImagePreviewModal;