import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "./components/ui/toaster";
import { AuthLayout, SignInForm, SignUpForm } from "./_auth";
import Loader from "./components/loader";

// Lazy load pages
const RootLayout = lazy(() => import("./pages/root-layout"));
const Home = lazy(() => import("./pages/home"));
const ExplorePage = lazy(() => import("./pages/explore-page"));
const ProfilePage = lazy(() => import("./pages/profile-page"));
const CreateRecipePage = lazy(() => import("./pages/create-recipe-page"));
const AllRecipes = lazy(() => import("./pages/all-recipes"));
const RecipePage = lazy(() => import("./pages/recipe-page"));
const UpdateRecipePage = lazy(() => import("./pages/update-recipe-page"));
const UpdateProfilePage = lazy(() => import("./pages/update-profile-page"));
const PostsPage = lazy(() => import("./pages/posts-page"));
const PostDetailsPage = lazy(() => import("./pages/post-details-page"));
const PaymentSuccess = lazy(() => import("./pages/payment-success-page"));
const PaymentFailure = lazy(() => import("./pages/payment-failure-page"));
const PrintPage = lazy(() => import("./pages/print-page"));
const NotFoundPage = lazy(() => import("./pages/not-found"));

function App() {
  return (
    <main className="flex h-screen overflow-hidden">
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/sign-in" element={<SignInForm />} />
        </Route>

        {/* Root Routes */}
        <Route
          element={
            <Suspense fallback={<Loader />}>
              <RootLayout />
            </Suspense>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<Loader />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/explore/*"
            element={
              <Suspense fallback={<Loader />}>
                <ExplorePage />
              </Suspense>
            }
          />
          <Route
            path="/profile/:userId/*"
            element={
              <Suspense fallback={<Loader />}>
                <ProfilePage />
              </Suspense>
            }
          />
          <Route
            path="/create-recipe"
            element={
              <Suspense fallback={<Loader />}>
                <CreateRecipePage />
              </Suspense>
            }
          />
          <Route
            path="/recipes"
            element={
              <Suspense fallback={<Loader />}>
                <AllRecipes />
              </Suspense>
            }
          />
          <Route
            path="/recipes/:id"
            element={
              <Suspense fallback={<Loader />}>
                <RecipePage />
              </Suspense>
            }
          />
          <Route
            path="/update-recipe/:id"
            element={
              <Suspense fallback={<Loader />}>
                <UpdateRecipePage />
              </Suspense>
            }
          />
          <Route
            path="/update-profile/:userId"
            element={
              <Suspense fallback={<Loader />}>
                <UpdateProfilePage />
              </Suspense>
            }
          />
          <Route
            path="/posts"
            element={
              <Suspense fallback={<Loader />}>
                <PostsPage />
              </Suspense>
            }
          />
          <Route
            path="/posts/:postId"
            element={
              <Suspense fallback={<Loader />}>
                <PostDetailsPage />
              </Suspense>
            }
          />
        </Route>

        {/* Independent Routes */}
        <Route
          path="/success"
          element={
            <Suspense fallback={<Loader />}>
              <PaymentSuccess />
            </Suspense>
          }
        />
        <Route
          path="/failure"
          element={
            <Suspense fallback={<Loader />}>
              <PaymentFailure />
            </Suspense>
          }
        />
        <Route
          path="/print/:id"
          element={
            <Suspense fallback={<Loader />}>
              <PrintPage />
            </Suspense>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <Suspense fallback={<Loader />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
