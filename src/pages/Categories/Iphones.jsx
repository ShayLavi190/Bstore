import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar'; 
import { Link } from 'react-router-dom';
import "./iphones.css";
import axios from 'axios';
import { Col, Container, Row } from 'react-bootstrap';
// Iphones component
const Iphones = () => {
  const [iphones, setIphones] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:6500/products/iphones');
        console.log('Iphones:', response.data.products);
        setIphones(response.data.products); 
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();  
  }, []);

  const handleSearch = () => {
    // Ensure iphones state is initialized before filtering
    const filteredProducts = iphones && iphones.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredProducts || []; // Return an empty array if iphones is still undefined
  };

  const handleFilter = () => {
    // Filter products by price range
    const filteredProducts = iphones.filter(product =>
      (!minPrice || parseInt(product.price) >= parseInt(minPrice)) &&
      (!maxPrice || parseInt(product.price) <= parseInt(maxPrice))
    );
    return filteredProducts;
  };

  const filteredProducts = handleSearch().filter(product => handleFilter().includes(product));

  return (
    <Container style={{marginTop:'80px'}}>
      <Row>
        <Col>
          <Navbar />
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="iphones-search-container">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div>
            <div className="filter-container">
              <form>
                <label htmlFor="from">From:</label>
                <input 
                  type="text" 
                  id="from" 
                  name="from" 
                  value={minPrice} 
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </form>
              <form>
                <label htmlFor="to">To:</label>
                <input 
                  type="text" 
                  id="to" 
                  name="to" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </form>
            </div>
          </div>
        </Col>
      </Row>
      <div className="products">
        <div className="product-slide">
          {filteredProducts.map((product, index) => (
            <Link to={product.link} key={index}>
              <div className="product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Iphones;
