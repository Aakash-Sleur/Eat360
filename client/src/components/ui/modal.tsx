import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

interface ModalProps {
    title: string | React.ReactNode;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode
    styles?: string
}

export const Modal = ({
    title,
    description,
    isOpen,
    onClose,
    children,
    styles
}: ModalProps) => {
    const onChange = (open: boolean) => {
        if (!open) {
            onClose()
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent className={`p-2 ${styles ? styles : " h-52 w-[95%]"} rounded-lg bg-white md:p-7 backdrop:bg-blue-500/50 flex flex-col gap-4`}>
                <DialogHeader className="p-2 mt-5 border-b-2 h-fit border-dark-1">
                    <DialogTitle className="text-xl prose capitalize">
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )

}