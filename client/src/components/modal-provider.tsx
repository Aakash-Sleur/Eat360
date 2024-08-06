import CreatePostModal from "./modals/create-post-modal"
import { ImagePreviewModal } from "./modals/image-preview-modal"
import { ShareModal } from "./modals/share-modal"
import { SocialNexusModal } from "./modals/social-nexus-modal"

const ModalProvider = () => {
    return (
        <>
            <ShareModal />
            <CreatePostModal />
            <SocialNexusModal />
            <ImagePreviewModal />
        </>
    )
}

export default ModalProvider
