import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shop-context";
import { CartItem } from "./cart-item";
import { useNavigate } from "react-router-dom";
import "./cart.css";
import Navbar from "./navbar";
import { PayPalScriptProvider,PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

// Cart component to display the cart page
export const Cart = () => {
  const { cartItems, products,setCartItems } = useContext(ShopContext);
  const [buyprod, setBuyprod] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate = useNavigate();
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    // Filter products that are in the cart
    const purchasedProducts = products.filter((product) => {
      return cartItems.hasOwnProperty(product.prod_id) && cartItems[product.prod_id] > 0;
    });
    const updatedProducts = purchasedProducts.map(product => ({
      ...product,
      ordered: cartItems[product.prod_id]
    }));
    setBuyprod(updatedProducts);
    // Calculate subtotal
    let total = 0;
    purchasedProducts.forEach((product) => {
      total += product.price * cartItems[product.prod_id];
    });
    setSubtotal(total);


    // Set dataLoaded to true when the data is loaded
    setDataLoaded(true);
  }, [cartItems, products]);
  
  // Function to handle the checkout button
  const handleCheckout = async () => {
    if (dataLoaded) {
      for (const product of buyprod) {
        const response = await axios.get(`http://localhost:6500/${product.category}/${product.index}`);
        if(response.data.name == product.name && response.data.isInStock == false && product.quntity < 1)
        {
          alert(`Sorry,${product.name} is out of stock`);
          setSubtotal(subtotal - product.price * buyprod.indexOf(product).quntity);
          buyprod.splice(buyprod.indexOf(product), 1);
          return;
        }
      }
      setSubtotal(0);
      setCartItems({});
      navigate('/checkout', { state: { buyprod } });
    }
  };
  
  return (
    <div>
      <Navbar />
      <div className="cart">
        <div>
          <h1 style={{marginTop:'90px'}}>Your Cart Items</h1>
        </div>
        <div className="cart">
          {buyprod.map((product) => (
            <CartItem data={product} quantity={cartItems[product.prod_id]} key={product.prod_id} />
          ))}
        </div>
        {buyprod.length > 0 ? (
          <div className="checkout">
            <p>Subtotal: ${subtotal}</p>
            <div className="buttons-container">
              <button className="continue-shopping" onClick={() => navigate("/shop")}>Continue Shopping</button>
              <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
            </div>
            <PayPalScriptProvider options={{ clientId: "AUw64R1RHWdRKv_e7P92hTsbT9gA8L5HZVFjhG-qM0jUhpYqFmj3B2XImLaftht90qgxQTZFzRH1rXML" }}>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: subtotal.toString(),
                        },
                      },
                    ],
                  });
                }}
                style={{ layout: "horizontal"}}
              />
            </PayPalScriptProvider>
          </div>
        ) : (
          <h1 style={{marginTop:'50px'}}>Your Shopping Cart is Empty</h1>
        )}
      </div>
    </div>
  );
};
