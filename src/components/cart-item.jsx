import React, { useContext,useState } from "react";
import { ShopContext } from "../context/shop-context";

// CartItem component to display the product item card in the cart page
export const CartItem = (props) => {
  const { prod_id, name, price, image, quntity } = props.data;
  const { cartItems, addToCart, removeFromCart } = useContext(ShopContext);
  const [quantity, setQuantity] = useState(1);
  // Delete the product item card from the page when quantity is zero
  if (quntity === 0) {
    return null;
  }
  // Function to increase the quantity of the product item card
  const handelAddToCart = () => {
    if((quntity-quantity)>=1){
      setQuantity(quantity+1)
      addToCart(prod_id)
    }
    else{
      alert("Product is out of stock in this quantity. Please remove it from cart.")
    }
  }
  // Function to decrease the quantity of the product item card
  const HandelRemoveFromCart = () => {
      setQuantity(quantity-1)
      removeFromCart(prod_id)
  }
  return (
    <div className="cartItem">
      <img src={image} alt={name} />
      <div className="description">
        <p>
          <b>{name}</b>
        </p>
        <p> Price: ${price}</p>
        <div className="countHandler">
          {/* Button to decrease quantity */}
          <button onClick={HandelRemoveFromCart}> - </button>
          {/* Display the quantity */}
          <span >{quantity}</span>
          {/* Button to increase quantity */}
          <button onClick={handelAddToCart}> + </button>
        </div>
      </div>
    </div>
  );
};
