import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import "./product.css";
import { useParams } from 'react-router-dom';
import { ShopContext } from '../../context/shop-context';
// Product component
const Product = () => {
  const { category, index } = useParams(); 
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [prod_id, setProd_id] = useState('');
  const [isInStock, setIsInStock] = useState(false);
  const [notify, setNotify] = useState([]);
  const [currency, setCurrency] = useState('');
  const [isTopSeller, setIsTopSeller] = useState(false);
  const [link, setLink] = useState('');
  const [_id, set_id] = useState({});
  const { addToCart } = useContext(ShopContext); 
  const [askAmount, setAskAmount] = useState(0);
  const [quantity, setQuantity] = useState(0);
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:6500/${category}/${index}`);
        const productData = response.data;
        setProd_id(productData.prod_id);
        setName(productData.name); 
        setPrice(productData.price); 
        setDescription(productData.desc); 
        setImage(productData.image);
        setIsInStock(productData.isInStock);
        setNotify(productData.notify);
        setCurrency(productData.currency);
        setIsTopSeller(productData.isTopSeller);
        setLink(productData.link);
        set_id(productData._id);
        setQuantity(productData.quntity);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();  
  }, [category, index]);

// Function to add the product to the cart
  const handleAddToCart = () => {
    setAskAmount(askAmount + 1);
    addToCart(prod_id,askAmount); // Call addToCart function from context
  };
  function getCookie(val) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === val) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
  }
  // Function to update the product
  const updateProduct = async (prod_id, updatedProductData) => {
    try {
      const response = await axios.put(`http://localhost:6500/products/${prod_id}`, updatedProductData);
      return response.data; 
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  };
  
// Function to handle the notify click
  const handelNotify = () => {
    if (!getCookie('email')) {
      alert("Please login to get notified.");
      return;
    }
    const userEmail = getCookie('email');
    const notifies = [...notify, userEmail];
    const updatedProductData = { name: name, price: price, desc: desc, image: image, prod_id: prod_id, currency: currency, isInStock: isInStock, notify: notifies, isTopSeller: isTopSeller, link: link};
    setNotify(notifies);
    updateProduct(prod_id, updatedProductData)
    .then(updatedProduct => {
      console.log('Product updated successfully:', updatedProduct);
    })
    .catch(error => {
      console.error('Failed to update product:', error);
    });
    console.log(notify);
    alert('You will be notified when the product is in stock');
  }

  return (
    <div>
      <Navbar />
      <Container style={{marginTop:'90px'}}>
        <Row>
          <Col>
            <h1>{name}</h1>
            <img src={image} alt={name} />
            <p>{desc}</p>
            <h2>{price} $</h2>
            {isInStock ? (
                <div>
                <p className='in-stock'>In Stock</p>
                <button className='buttonadd' onClick={handleAddToCart}>Add to Cart</button>
                </div>
              ) : (
                <div>
                  <p className='out-stock'>Out of Stock</p>
                  <button className='notify' onClick={handelNotify}>Notify Me</button>
                </div>
              )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Product;
