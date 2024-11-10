import { useCallback, useState } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"

import { Button } from "@/components/ui/button"
import { convertFileToUrl } from "@/lib/utils"

type FileUploadProps = {
    fieldChange: (files: File[]) => void
    mediaUrl: string
    setIsFileUploaded: (value: boolean) => void
}

export default function FileUploader({ fieldChange, mediaUrl, setIsFileUploaded }: FileUploadProps) {
    const [fileUrl, setFileUrl] = useState<string>(mediaUrl)

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        fieldChange(acceptedFiles)
        setFileUrl(convertFileToUrl(acceptedFiles[0]))
        setIsFileUploaded(true)
    }, [fieldChange, setIsFileUploaded])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg']
        },
        maxFiles: 1
    })

    return (
        <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 bg-gray-50'
                }`}
        >
            <input {...getInputProps()} className="sr-only" aria-label="Upload file" />
            {fileUrl ? (
                <div className="relative w-full aspect-video">
                    <img
                        src={fileUrl}
                        alt="Uploaded file"
                        className="object-cover rounded-lg"
                    />
                    <p className="mt-2 text-sm text-gray-500">Click or drag a new photo to replace</p>
                </div>
            ) : (
                <div className="text-center">
                    <img
                        src="/icons/file-upload.svg"
                        width={96}
                        height={77}
                        alt=""
                        className="mx-auto mb-4"
                    />
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                        Drag photo here
                    </h3>
                    <p className="mb-4 text-sm text-gray-500">SVG, PNG, JPG (max. 800x400px)</p>
                    <Button type="button" variant="outline">
                        Select from computer
                    </Button>
                </div>
            )}
        </div>
    )
}