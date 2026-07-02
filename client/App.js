import React, { useEffect } from "react";
import ReactDOM from "react-dom/client"
import Header from "./Components/Header";
import Products from "./Components/Products";
import { createBrowserRouter,Outlet,RouterProvider, } from "react-router-dom"
import Cart from "./Components/Cart";
import { Provider, useDispatch, useSelector } from "react-redux"
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
import ShoppingAgent from "./Components/ShoppingAgent";


import { setCart } from "./Components/reducers/CartSlice";

const App = ()=>{
    const dispatch = useDispatch();
    const navigate = useLocation();
    const isCartRoute = () => {
        return location.pathname === '/cart';
    };
    
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('user'));
        const server_url = process.env.REACT_APP_SERVER_URL;
        
        const fetchInitialCart = async () => {
            if (!userInfo) return;
            try {
                const result = await fetch(server_url + "/cart/get", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: userInfo.email }),
                });
                const ans = await result.json();
                if (ans.cartOrders && ans.cartOrders.product_info) {
                    dispatch(setCart(ans.cartOrders.product_info));
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchInitialCart();
    }, [dispatch]);

    const cartItems = useSelector((store) => store.cart.items);
    const isLoaded = useSelector((store) => store.cart.isLoaded);
    
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('user'));
        const server_url = process.env.REACT_APP_SERVER_URL;
        
        const syncCart = async () => {
            if (!userInfo) return;
            try {
                await fetch(server_url + "/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: userInfo.email, cartDetails: cartItems }),
                });
            } catch (error) {
                console.log(error);
            }
        };

        // Only sync if the cart has been loaded from the backend first
        // This prevents overwriting the DB with an empty array on the first render,
        // while still allowing the cart to sync when it is emptied by the user.
        if (isLoaded) {
            syncCart();
        }
    }, [cartItems, isLoaded]);

    return (
        <div>
            <Header/>
            <Outlet/>
            <ShoppingAgent />
            {!isCartRoute() && <Footer />}
        </div>
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