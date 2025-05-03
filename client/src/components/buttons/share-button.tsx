import { RefAttributes } from "react";

import { Button, ButtonProps } from "../ui/button";
import { useOrigin } from "@/hooks/common-hooks/hooks";
// import { useShareModal } from "@/hooks/modal-hooks";

type ShareButtonProps = {
    id: string;
    type: "recipes" | "posts";
    children: React.ReactNode;
    props?: ButtonProps & RefAttributes<HTMLButtonElement>;
};

const ShareButton = ({ id, type, children = "", props }: ShareButtonProps) => {
    const origin = useOrigin();
    // const { onOpen, updateModalData } = useShareModal();

    const handleShare = () => {
        navigator.share({
            title: "Check this out!",
            text: "Check out this awesome content!",
            url: `${origin}/${type === "recipes" ? "recipe" : "post"}/${id}`,
        })
            .then(() => {
                console.log("Content shared successfully!");
            })
            .catch((error) => {
                console.error("Error sharing content:", error);
            })
    };

    return (
        <Button variant="link" className={`${type === "recipes" && "border-r"} p-0 m-0 capitalize`} onClick={handleShare} {...props}>
            <img
                src="/icons/share.svg"
                alt="Share"
                className="mr-2 cursor-pointer size-5"
            />
            {children}
        </Button>
    )
}
export default ShareButton
