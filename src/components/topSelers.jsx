import React, { useEffect, useState } from 'react';
import "./topselers.css";
import axios from 'axios';
import { Link } from 'react-router-dom';

// TopSellers component to display the top seller products
const TopSellers = () => {
  const [topSellerProducts, setTopSellerProducts] = useState([]);

  useEffect(() => {
    // Fetch top seller products from MongoDB database
    // and update the topSellerProducts state
    const fetchTopSellerProducts = async () => {
      try {
        const response = await axios.get('http://localhost:6500/products/top-sellers');
        setTopSellerProducts(response.data.products); 
      } catch (error) {
        console.error('Error fetching top seller products:', error);
      }
    };

    fetchTopSellerProducts();
    console.log(topSellerProducts);

  }, []);

  return (
    <div className="top-sellers">
      <h2>Top Sellers</h2>
      <div className="product-slide">
        {topSellerProducts.map((product, index) => ( // Use index as key
            <Link to={`/${product.category}/${product.index}`}>
            <div key={index} className="product-card">
            <img src={product.image} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default TopSellers;
