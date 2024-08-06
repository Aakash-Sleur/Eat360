import { Outlet, Navigate } from "react-router-dom"

import { useUserContext } from "@/context/auth-store"


const AuthLayout = () => {
    const { isAuthenticated } = useUserContext();

    return (
        <>
            {
                isAuthenticated ? (
                    <Navigate to="/" />
                ) : (
                    <>
                        <section className="flex flex-col items-center justify-center flex-1 p-10">
                            <Outlet />
                        </section>
                        <img
                            src="/images/side-image.avif"
                            alt="logo"
                            className="hidden object-cover w-1/2 h-screen bg-no-repeat xl:block"
                        />
                    </>
                )
            }
        </>
    )
}

export default AuthLayout
