import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import emailjs from '@emailjs/browser';

export const ShopContext = createContext(null);
// ShopContextProvider component to provide the context to the app
export const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  useEffect(() => {
    fetchProducts(); 
    const interval = setInterval(fetchProducts, 60000); 

    return () => clearInterval(interval);
  }, []);
// Function to fetch products from the database
const fetchProducts = async () => {
  try {
      const response = await axios.get("http://localhost:6500/products");
      const fetchedProducts = response.data.products;
      setProducts(fetchedProducts);
      const serviceId = "service_lxiaq84";
      const templateId = "template_kzggrep";
      emailjs.init("98g7Qzscyfz-S-J7p")
      for (const product of fetchedProducts) {
          if (product.notify && product.notify.length > 0 && product.quntity > 0) {
              for (const email of product.notify) {
                  try {
                      await emailjs.send(serviceId, templateId, {
                          email: email,
                          name: product.name,});
                          console.log("Email sent to:", email);
                  } catch (error) {
                      console.log(error);
                  }
              }
              product.notify = [];
              console.log("Product updated:", product);
              updateProduct(product.prod_id,product);
          }
      }
  } catch (error) {
      console.error("Error fetching products:", error);
  }
};

// Function to update the product in the database
  const updateProduct = async (prod_id, updatedProductData) => {
    try {
      const response = await axios.put(`http://localhost:6500/products/${prod_id}`, updatedProductData);
      return response.data; 
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  };

// Function to add the product to the cart
  const addToCart = (itemId,askAmount) => {
    const product = products.find((product) => product.prod_id === itemId);
    if (!product) {
      console.error(`Product with ID ${itemId} not found.`);
      return;
    }
    if (product.quntity-askAmount < 0) {
      alert('Sorry, this product is out of stock.');
      return;
    }
    setCartItems((prevCartItems) => {
      const updatedCartItems = { ...prevCartItems };
      updatedCartItems[itemId] = updatedCartItems[itemId] ? updatedCartItems[itemId] + 1 : 1;
      return updatedCartItems;
    });
    if(product.quntity-1<=0){
      product.isInStock = false;
    }
    updateProduct(itemId, { ...product, quntity: product.quntity - askAmount ,isInStock:product.isInStock});
  
    alert("Item added to cart");
  };
  
// Function to remove the product from the cart
const removeFromCart = (itemId) => {
  const product = products.find((product) => product.prod_id === itemId);
  setCartItems((prevCartItems) => {
    const updatedCartItems = { ...prevCartItems };
    if (updatedCartItems[itemId] && updatedCartItems[itemId] > 1) {
      updatedCartItems[itemId] -= 1; // Decrease quantity by 1 if it's more than 0
    } else {
      delete updatedCartItems[itemId]; // Remove the item if quantity becomes 0 or less
    }
    return updatedCartItems;
  });
  // Update the quantity in the database
  updateProduct(itemId, { ...product, quntity: product.quntity - 1 });
};
// Function to update the quantity of the product in the cart
  const updateCartItemCount = (newAmount, itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: newAmount }));
  };
// Function to checkout the cart
  const checkout = () => {
    setCartItems({});
  };

  const contextValue = {
    cartItems,
    addToCart,
    updateCartItemCount,
    removeFromCart,
    checkout,
    products,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
