import { Loader as LoaderIcon } from "lucide-react";

const Loader = () => {
    return (
        <div className="w-full flex-center">
            <LoaderIcon className="animate-spin" />
        </div>
    );
}

export default Loader;