import React from "react";
import ReactDOM from "react-dom/client"
import Header from "./Components/Header";
import Products from "./Components/Products";
import { createBrowserRouter,Outlet,RouterProvider, } from "react-router-dom"
import Cart from "./Components/Cart";
import { Provider } from "react-redux"
import appStore from "./Components/reducers/AppStore";
import ProductPage from "./Components/ProductPage";
import Body from "./Components/Body";
import Login from "./Components/LoginPage";
import RegisterPage from "./Components/RegisterPage";
import Footer from "./Components/Footer";
import { useLocation } from 'react-router-dom';
import CheckoutPage from "./Components/CheckoutPage";




const App = ()=>{

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
      element: <App/>,
      children: [
        {
          path:"/cart",
          element:<Cart/>
        },
        {
          path:"/products/:category",
          element:<Products/>
        },
        {
          path:"/products/:category/:name",
          element:<ProductPage/>
        }
        ,{
          path:"/",
          element:<Body/>
        },
        {
          path:"/login",
          element:<Login/>
        },
        
      ],
      
      errorElement: <Error/>
    },
    {
      path:"/register",
      element:<RegisterPage/>
    },
    {
      path:"/checkout",
      element:<CheckoutPage/>
    }
   
  ])


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Provider store={appStore}><RouterProvider router={appRouter}/></Provider>);

// useEffect api call ko hook banao