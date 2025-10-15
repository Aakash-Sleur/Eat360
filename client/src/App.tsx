import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, ReactElement } from "react";
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
const DemoPage = lazy(() => import("./pages/demo-page")); 

// Custom Lazy Load Component
const LazyLoad = (Component: React.FC): ReactElement => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

function App() {
  return (
    <main className="flex h-screen overflow-hidden">
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="/sign-in" element={<SignInForm />} />
          </Route>

          {/* Root Routes */}
          <Route element={LazyLoad(RootLayout)}>
            <Route index element={LazyLoad(Home)} />
            <Route path="/explore/*" element={LazyLoad(ExplorePage)} />
            <Route path="/profile/:userId/*" element={LazyLoad(ProfilePage)} />
            <Route path="/create-recipe" element={LazyLoad(CreateRecipePage)} />
            <Route path="/recipes" element={LazyLoad(AllRecipes)} />
            <Route path="/recipes/:id" element={LazyLoad(RecipePage)} />
            <Route path="/update-recipe/:id" element={LazyLoad(UpdateRecipePage)} />
            <Route path="/update-profile/:userId" element={LazyLoad(UpdateProfilePage)} />
            <Route path="/posts" element={LazyLoad(PostsPage)} />
            <Route path="/posts/:postId" element={LazyLoad(PostDetailsPage)} />
            <Route path="/demo" element={LazyLoad(DemoPage)} />
          </Route>

          {/* Independent Routes */}
          <Route path="/success" element={LazyLoad(PaymentSuccess)} />
          <Route path="/failure" element={LazyLoad(PaymentFailure)} />
          <Route path="/print/:id" element={LazyLoad(PrintPage)} />

          {/* 404 Route */}
          <Route path="*" element={LazyLoad(NotFoundPage)} />
        </Routes>
      </Suspense>
      <Toaster />
    </main>
  );
}

export default App;
