import { Route, Routes } from "react-router-dom"

import { Toaster } from "./components/ui/toaster"
import {
  AllRecipes,
  CreateRecipePage,
  ExplorePage,
  Home,
  PostsPage,
  ProfilePage,
  RecipePage,
  RootLayout,
  UpdateProfilePage,
  UpdateRecipePage,
  PostDetailsPage,
  PaymentSuccess,
  PaymentFailure,
  PrintPage
} from "./pages"
import { AuthLayout, SignInForm, SignUpForm } from "./_auth"



function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/sign-in" element={<SignInForm />} />
        </Route>

        {/* Root Routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore/*" element={<ExplorePage />} />
          <Route path="/create-recipe" element={<CreateRecipePage />} />
          <Route path="/profile/:userId/*" element={<ProfilePage />} />
          <Route path="/update-profile/:userId" element={<UpdateProfilePage />} />
          <Route path="/update-recipe/:id" element={<UpdateRecipePage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/:postId" element={<PostDetailsPage />} />
          <Route path="/recipes" element={<AllRecipes />} />
          <Route path="/recipes/:id" element={<RecipePage />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/failure" element={<PaymentFailure />} />
        </Route>

        {/* Print Route */}
        <Route path="/print/:id" element={<PrintPage />} />
      </Routes>
      <Toaster />
    </main>
  )
}

export default App
