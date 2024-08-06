import { useNavigate } from "react-router-dom";

import { Modal } from "../ui/modal";
import { useSocialNexusModal } from "@/hooks/modal-hooks";

export const SocialNexusModal = () => {
    const { isOpen, onClose, type, data } = useSocialNexusModal();
    const navigate = useNavigate();

    const onClick = (userId: string) => {
        onClose();
        navigate(`/profile/${userId}`);
        navigate(0);
    }


    return (
        <Modal
            title={type === "followers" ? "Followers" : "Following"}
            description=""
            isOpen={isOpen}
            onClose={onClose}
            styles="h-[30rem] overflow-scroll custom-scrollbar"
        >
            <section className="flex flex-col flex-wrap items-start justify-start gap-2 p-5 text-black">
                {
                    !data.length ? (
                        <p className="w-full text-xl font-bold text-center ">Currently No {type}</p>
                    ) : (
                        data.map((user) => (
                            <div onClick={() => onClick(user._id)} key={user._id} className="w-full hover:cursor-pointer">
                                <article className="flex items-center justify-around ">
                                    <img src={user.profilePicture} alt={`profile-${user.name}`} className="rounded-full size-10" />
                                    <p>@{user.name}</p>
                                </article>
                            </div>
                        ))
                    )
                }
            </section>
        </Modal>
    );
};
