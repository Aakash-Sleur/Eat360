import { Copy, Link } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useShareModal } from "@/hooks/modal-hooks"
import { Modal } from "../ui/modal"

export const ShareModal = () => {
    const { isOpen, onClose, link } = useShareModal();

    const onCopy = () => {
        navigator.clipboard.writeText(link);
    };


    return (
        <Modal
            title="share"
            description="Share through the below link"
            isOpen={isOpen}
            onClose={onClose}
        >

            <section className="flex justify-center gap-2">
                <Link size={32} className="hidden md:block" />
                <p className="w-full p-[6px] border-2 rounded-md border-slate-900 text-small-medium overflow-hodden min-h-10">
                    {
                        link.length > 30
                            ? link.slice(0, 30) + "..."
                            : link
                    }
                </p>
                <Button variant={"outline"} onClick={onCopy} className="border-2 border-slate-900">
                    <Copy size={15} className="text-slate-900" />
                </Button>
            </section>

        </Modal>
    )
}
