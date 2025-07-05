import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Loader from "@/components/loader";
import { SignInFormValidation } from "@/lib/validations";
import { useUserContext } from "@/context/auth-store";
import { setUserCredentials } from "@/lib/utils";
import { IUser } from "@/lib/types";
import { useLoginUser } from "@/lib/react-query/queries-and-mutations";
import { useToast } from "@/components/ui/use-toast";



const SignInForm = () => {
    const { toast } = useToast()
    const navigate = useNavigate();
    const { setUser, checkAuthUser } = useUserContext();

    const { mutateAsync: loginUser, isPending: isLogginIn } = useLoginUser();

    const form = useForm<z.infer<typeof SignInFormValidation>>({
        resolver: zodResolver(SignInFormValidation),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof SignInFormValidation>) {
        const newUser: IUser = await loginUser(values);
        if (!newUser) return toast({ title: "Sign in failed. Please try again." })

        setUserCredentials(newUser);
        setUser({ ...newUser });

        const isLoggedIn = await checkAuthUser();

        if (isLoggedIn) {
            form.reset();
            navigate("/")
            toast({ title: `Welcome back ${newUser.name}` })
        } else {
            return toast({ title: "Sign up failed. Please try again.", })
        }

    }

    return (
        <Form {...form}>
            <div className="flex-col sm:w-420 flex-center">
                <img src="/images/logo.png" alt="logo" />

                <h2 className="pt-2 h3-bold md:h2-bold sm:pt-12">
                    Log in to your account
                </h2>
                <p className="pt-5 text-light-3 small-medium sm:pt-12">
                    Welcome back! Please enter your details
                </p>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col w-full gap-5 mt-4"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">Email</FormLabel>
                                <FormControl>
                                    <Input type="email" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="shad-button_primary">
                        {isLogginIn ? (
                            <div className="gap-2 flex-center">
                                <Loader /> loading...
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                    <p className="mt-2 text-center text-small-regular text-dark-2">
                        Don't have an account
                        <Link to={"/sign-up"} className="ml-1 text-primary-500 text-small-semibold">Register</Link>
                    </p>
                </form>
            </div >
        </Form>

    );
}

export default SignInForm;