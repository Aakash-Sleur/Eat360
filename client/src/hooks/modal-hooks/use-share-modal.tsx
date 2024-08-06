import { create } from 'zustand'

interface ShareModalStore {
    isOpen: boolean;
    link: string;
    onOpen: () => void;
    onClose: () => void;
    updateModalData: (newData: { link?: string }) => void;
}


const useShareModal = create<ShareModalStore>((set) => ({
    isOpen: false,
    link: "",
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    updateModalData: (newData) => set((state) => ({ ...state, ...newData })),
}));

export default useShareModal;