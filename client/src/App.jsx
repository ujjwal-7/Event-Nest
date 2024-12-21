import React from "react";
import { Routes, Route } from "react-router-dom";
import { OrderContextProvider } from "./context/OrderContext";
import { AuthContextProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Fallback from "./pages/Fallback";

const Home = React.lazy(() => import("./pages/Home"));
const EventPage = React.lazy(() => import("./pages/EventPage"));
const Success = React.lazy(() => import("./pages/Success"));
const Cancel = React.lazy(() => import("./pages/Cancel"));
const Order = React.lazy(() => import("./pages/Order"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const SignUpPage = React.lazy(() => import("./pages/SignUpPage"));
const CreateEventPage = React.lazy(() => import("./pages/CreateEventPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const EditEventPage = React.lazy(() => import("./pages/EditEventPage"));
const SearchResults = React.lazy(() => import("./pages/SearchResults"));
const OrderDetails = React.lazy(() => import("./pages/OrderDetails"));
const BookmarkPage = React.lazy(() => import("./pages/BookmarkPage"))


function App() {
  return (
    <AuthContextProvider>
      <OrderContextProvider>
        <Layout>
          <ScrollToTop />
          <React.Suspense fallback={<Fallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/users/:userId"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/events/:eventId" element={<EventPage />} />
              <Route
                path="/events/update/:eventId"
                element={
                  <ProtectedRoute>
                    <EditEventPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route
                path="/order"
                element={
                  <ProtectedRoute>
                    <Order />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/success"
                element={
                  <ProtectedRoute>
                    <Success />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cancel"
                element={
                  <ProtectedRoute>
                    <Cancel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-event"
                element={
                  <ProtectedRoute>
                    <CreateEventPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/:eventId/orders"
                element={
                  <ProtectedRoute>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />
              <Route path="/bookmarks" element={<BookmarkPage />} />
              <Route path="/search" element={<SearchResults />} />
            </Routes>
          </React.Suspense>
        </Layout>
      </OrderContextProvider>
    </AuthContextProvider>
  );
}

export default App;
