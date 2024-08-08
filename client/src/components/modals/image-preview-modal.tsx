import { useImagePreviewModal } from "@/hooks/modal-hooks"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import CustomImage from "../shared/custom-image";

export const ImagePreviewModal = () => {
    const { isOpen, onClose, data } = useImagePreviewModal();

    const onChange = (open: boolean) => {
        if (!open) {
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent className={` rounded-lg bg-white backdrop:bg-blue-500/50 p-6 max-w-4xl flex flex-col gap-4`}>
                <CustomImage src={data} alt="preview-image" className="object-cover w-full rounded-lg" />
            </DialogContent>
        </Dialog>
    )
}
