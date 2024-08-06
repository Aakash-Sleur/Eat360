import { useMemo, useRef } from "react";

// Importing core components
import ReactQuill from "react-quill";

// Importing styles
import "react-quill/dist/quill.snow.css"

if (process.env.NODE_ENV !== 'production') {
    const consoleWarn = console.warn;
    console.warn = (...args) => {
        if (args[0] && args[0].includes('findDOMNode is deprecated')) {
            return;
        }
        consoleWarn(...args);
    };
}

type EditorProps = {
    value: string;
    onChange: (value: string) => void;
};


const Editor = ({ value, onChange }: EditorProps) => {
    // Editor state

    // Editor ref
    const quill = useRef<ReactQuill | null>(null);


    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, false] }],
                    ["bold", "italic", "underline", "blockquote"],
                    [{
                        color: [
                            "#000000",
                            "#ffffff",
                            "#ff0000",
                            "#00ff00",
                            "#0000ff",
                        ]
                    }],
                    [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                    ],
                    ["link"],
                    ["clean"],
                ],
            },
            clipboard: {
                matchVisual: true,
            },
        }),
        []
    );

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "color",
        "clean",
    ];

    return (
        <div className="p-2 h-[30rem]">
            <ReactQuill
                ref={(el) => (quill.current = el)}
                className="h-[400px] w-full"
                theme="snow"
                value={value}
                formats={formats}
                modules={modules}
                onChange={(value) => onChange(value)}
            />
        </div>
    );
};

export default Editor;
