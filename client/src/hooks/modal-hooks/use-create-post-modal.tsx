import { create } from "zustand";

interface CreatePostStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useCreatePostModal = create<CreatePostStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useCreatePostModal;