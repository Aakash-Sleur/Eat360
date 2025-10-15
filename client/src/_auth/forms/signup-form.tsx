
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input"
import { SignUpFormValidation } from "@/lib/validations";
// import Loader from "@/components/loader";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "@/lib/react-query/queries-and-mutations";
import { IUser } from "@/lib/types";
import { useUserContext } from "@/context/auth-store";
import { setUserCredentials } from "@/lib/utils";
import Loader from "@/components/loader";
import CustomImage from "@/components/shared/custom-image";




const SignUpForm = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUserMutation();
    const { checkAuthUser, setUser } = useUserContext();

    const form = useForm<z.infer<typeof SignUpFormValidation>>({
        resolver: zodResolver(SignUpFormValidation),
        defaultValues: {
            username: "",
            name: "",
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof SignUpFormValidation>) {
        const newUser: IUser = await createUser(values);
        if (!newUser) return toast({ title: "Sign up failed. Please try again." })
        setUserCredentials(newUser);
        setUser({ ...newUser });

        const isLoggedIn = await checkAuthUser();

        if (isLoggedIn) {
            form.reset();
            navigate("/")
        } else {
            return toast({ title: "Sign up failed. Please try again." })
        }
    }

    return (
        <Form {...form}>
            <div className="flex-col sm:w-420 flex-center">
                <CustomImage src="/images/logo.png" alt="logo" />

                <h2 className="pt-2 h3-bold md:h2-bold sm:pt-12">
                    Create a new account
                </h2>
                <p className="pt-5 text-light-3 small-medium sm:pt-12">
                    To use Eat 360 , Please enter your details
                </p>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col w-full gap-5 mt-4"
                >
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">Username</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">Name</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                        {isCreatingUser ? (
                            <div className="gap-2 flex-center">
                                <Loader /> loading...
                            </div>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>
                    <p className="mt-2 text-center text-small-regular text-dark-2">
                        Already have an account
                        <Link to={"/sign-in"} className="ml-1 text-primary-500 text-small-semibold">Login</Link>
                    </p>
                </form>
            </div >
        </Form>

    );
}

export default SignUpForm;