import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { convertFileToUrl } from "@/lib/utils";
import CustomImage from "./custom-image";

type ImageUploaderProps = {
    fieldChange: (files: File[]) => void;
    mediaUrl: string;
    setIsFileUploaded: (value: boolean) => void;
}

const ImageUploader = ({
    fieldChange,
    mediaUrl,
    setIsFileUploaded
}: ImageUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            setFile(acceptedFiles);
            fieldChange(acceptedFiles);
            setFileUrl(convertFileToUrl(acceptedFiles[0]));
            setIsFileUploaded(true);
        },
        [file]
    )

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpeg", ".jpg"],
        }
    })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} className="cursor-pointer" />

            <div className="gap-4 cursor-pointer flex-center">
                <CustomImage
                    src={fileUrl || "/icons/profile-placeholder.svg"}
                    alt="image"
                    className="object-cover object-top w-24 h-24 rounded-full"
                />
                <p className="text-primary-500 small-regular md:base-semibold">
                    Change profile photo
                </p>
            </div>
        </div>
    );
}

export default ImageUploader;