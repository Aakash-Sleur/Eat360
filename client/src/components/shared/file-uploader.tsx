import { useCallback, useState } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"

import { Button } from "../ui/button";
import { convertFileToUrl } from "@/lib/utils";

type FileUploadProps = {
    fieldChange: (files: File[]) => void;
    mediaUrl: string;
    setIsFileUploaded: (value: boolean) => void;
}

const FileUploader = ({ fieldChange, mediaUrl, setIsFileUploaded }: FileUploadProps) => {
    const [file, setFile] = useState<File[]>([])
    const [fileUrl, setFileUrl] = useState<string>(mediaUrl)

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            setFile(acceptedFiles);
            fieldChange(acceptedFiles);
            setFileUrl(convertFileToUrl(acceptedFiles[0]));
            setIsFileUploaded(true);
        }, [file]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpeg", ".jpg"]
        }
    })

    return (
        <div {...getRootProps()} className="flex flex-col border-2 cursor-pointer flex-center bg-slate-200 rounded-xl">
            <input {...getInputProps()} className="cursor-pointer" />
            {
                fileUrl ?
                    (
                        <>
                            <div className="flex justify-center flex-1 w-full p-5 border text-dark-1 lg:p-10">
                                <img src={fileUrl} alt="image" className="file_uploader-img" />
                            </div>
                            <p className="file_uploader-label">Click or drag photo to replace</p>
                        </>
                    ) : (
                        <div className="file_uploader-box">
                            <img
                                src="/icons/file-upload.svg"
                                width={96}
                                height={77}
                                alt="file upload"
                            />
                            <h3 className="mt-6 mb-2 base-medium text-light-2">
                                Drag photo here
                            </h3>
                            <p className="mb-6 text-light-4 small-regular">SVG, PNG, JPG</p>

                            <Button type="button" className="shad-button_dark_4">
                                Select from computer
                            </Button>
                        </div>
                    )
            }
        </div>
    )
}

export default FileUploader