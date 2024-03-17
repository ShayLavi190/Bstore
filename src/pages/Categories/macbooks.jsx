import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar'; 
import { Link } from 'react-router-dom';
import "./iphones.css";
import axios from 'axios';
import { Col, Container, Row } from 'react-bootstrap';

const Macbooks = () => {
  const [macbooks, setMacbooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    // Fetch products from the server
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:6500/products/macbooks');
        setMacbooks(response.data.products); 
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();  
  }, []);

  const handleSearch = () => {
    // Filter products by name containing searchQuery
    const filteredProducts = macbooks.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredProducts;
  };

  const handleFilter = () => {
    // Filter products by price range
    const filteredProducts = macbooks.filter(product =>
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

export default Macbooks;
