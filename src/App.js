// Importing necessary dependencies
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstPage from "./pages/Login/FirstPage";
import HomePage from "./pages/HomePage/HomePage";
import { Contact } from "./pages/Contact/contact";
import Iphones from "./pages/Categories/Iphones";
import Macbooks from "./pages/Categories/macbooks";
import Iwatches from "./pages/Categories/iwatches";
import Product from "./pages/Product/Product";
import { ShopContextProvider } from "./context/shop-context";
import { Cart } from "./components/cart";
import Checkout from "./pages/Checkout/Checkout";
import MyAccount from "./pages/MyAccount/MyAccount";
import MyOrders from "./pages/MyOrders/MyOrders";
import PersonalInformation from "./pages/Info/info";
import ForgotPassword from "./pages/Login/forgotpassword";
import { useEffect } from "react";

// Main App component
function App() {
  useEffect(() => {
    // Dynamically create the viewport meta tag
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0';
    
    // Append the meta tag to the document head
    document.head.appendChild(viewportMeta);

    // Cleanup function to remove the added meta tag when component unmounts
    return () => {
      document.head.removeChild(viewportMeta);
    };
  }, []);
  return (
    <div className="App">
      <ShopContextProvider> 
        {
        // Router setup for handling different routes
        <Router>
          <Routes>
            <Route path="/cart" element={<Cart />} />
            <Route path="/" element={<FirstPage />} />
            <Route path="/iphones" element={<Iphones />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/macbooks" element={<Macbooks />} />
            <Route path="/iwatches" element={<Iwatches />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<HomePage />} />
            <Route path="/myaccount" element={<MyAccount />} />
            <Route path="/:category/:index" element={<Product />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/personaldata" element={<PersonalInformation />} />
          </Routes>
        </Router>
        }
      </ShopContextProvider>
    </div>
  );
}

export default App;
