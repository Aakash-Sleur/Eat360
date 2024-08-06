import { Link, useLocation } from "react-router-dom";

import { footerLinks } from "@/constants"

const FooterComponent = () => {
    const { pathname } = useLocation();

    return (
        <section className="footer">
            {
                footerLinks.map((link) => {
                    const isActive = pathname === link.route;
                    return (
                        <Link
                            key={`footer-${link.label}`}
                            to={link.route}
                            className={`${isActive && "rounded-[10px] bg-eat-orange text-white"} flex-center flex-col gap-1 p-3 transition`}
                        >
                            <img
                                src={link.imgUrl}
                                alt={link.label}

                                className={`${isActive && "invert-white"}`}
                            />
                            <p className={`tiny-medium ${!isActive && "text-dark-1"}}`}>{link.label}</p>
                        </Link>
                    )
                })
            }
        </section>
    )
}

export default FooterComponent
