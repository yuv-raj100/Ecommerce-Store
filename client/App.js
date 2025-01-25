import React, { useEffect } from "react";
import ReactDOM from "react-dom/client"
import Header from "./Components/Header";
import Products from "./Components/Products";
import { createBrowserRouter,Outlet,RouterProvider, } from "react-router-dom"
import Cart from "./Components/Cart";
import { Provider, useDispatch } from "react-redux"
import appStore from "./Components/reducers/AppStore";
import ProductPage from "./Components/ProductPage";
import Body from "./Components/Body";
import Login from "./Components/LoginPage";
import RegisterPage from "./Components/RegisterPage";
import Footer from "./Components/Footer";
import { useLocation } from 'react-router-dom';
import CheckoutPage from "./Components/CheckoutPage";
import { addItem } from "./Components/reducers/UserSlice";
import LoginPage from "./Components/LoginPage";
import UserProfile from "./Components/UserProfile";
import ProtectedRoute from "./Components/authroizedRoutes/ProtectedRoute";
import ProtectedRouteForCheckout from "./Components/authroizedRoutes/ProtectedRouteForCheckout";
import RedirectIfLoggedIn from "./Components/authroizedRoutes/RedirectLoggedIn";




const App = ()=>{
    const dispatch = useDispatch();
    const navigate = useLocation();
    const isCartRoute = () => {
        return location.pathname === '/cart';
    };
    


    return (
        <Provider store={appStore}>
            <div>
                <Header/>
                <Outlet/>
                {!isCartRoute() && <Footer />}
            </div>
        </Provider>
    )
}

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/products/:category",
        element: <Products />,
      },
      {
        path: "/products/:category/:name",
        element: <ProductPage />,
      },
      {
        path: "/",
        element: <Body />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
    ],

    errorElement: <Error />,
  },
  {
    path: "/register",
    element: (
      <RedirectIfLoggedIn>
        <RegisterPage />
      </RedirectIfLoggedIn>
    ),
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRouteForCheckout>
        <CheckoutPage />
      </ProtectedRouteForCheckout>
    ),
  },
  {
    path: "/login",
    element: (
      <RedirectIfLoggedIn>
        <LoginPage />
      </RedirectIfLoggedIn>
    ),
  },
]);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Provider store={appStore}><RouterProvider router={appRouter}/></Provider>);

// useEffect api call ko hook banao