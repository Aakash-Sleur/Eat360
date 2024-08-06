import { create } from "zustand";

import { IUser } from "@/lib/types";


interface SocialNexusStore {
    isOpen: boolean;
    type: "followers" | "following" | null;
    data: IUser[];
    updateModalData: (newData: { data: IUser[] }) => void;
    onOpen: (type: "followers" | "following" | null) => void;
    onClose: () => void;
}

const useSocialNexusModal = create<SocialNexusStore>((set) => ({
    isOpen: false,
    type: "followers",
    data: [],
    updateModalData: (newData) => set((state) => ({ ...state, ...newData })),
    onOpen: (type) => set({ isOpen: true, type }),
    onClose: () => set({ isOpen: false, data: [] }),
}));

export default useSocialNexusModal;