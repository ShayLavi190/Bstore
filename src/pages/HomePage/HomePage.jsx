import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Navbar from '../../components/navbar';
import TopSellers from '../../components/topSelers';
import "./homepage.css";
import { Link, useNavigate } from 'react-router-dom'; 
import iPhoneImage from './assets/iphonec.png'; 
import MacBookImage from './assets/macbookc.webp'; 
import IWatchImage from './assets/iwatchc.png'; 
import video from './assets/video.mp4';
import videoMac from './assets/videoMac.mp4';
import { Routes, Route, Navigate } from 'react-router-dom';
// HomePage component
const HomePage = () => {
  return (
    <Container style={{marginTop : '80px'}}>
      <Row>
        <Col>
          <Navbar />
        </Col>
      </Row>
      <Row>
        <div className='vid'>
            <span>
            <video className="full-width-video" autoPlay loop muted>
              <source src={video} type="video/mp4" />
            </video>
            <video className="full-width-video" autoPlay loop muted>
              <source src={videoMac} type="video/mp4" />
            </video>
            </span>
          </div>
      </Row>
      <Row>
        <Col>
          <TopSellers />
        </Col>
      </Row>
      <Row>
        <Col className='categories'>
          <h2>Categories</h2>
          <div className="categories-row" style={{ marginRight: '170px' }}>
            <Card>
                <Link to = '/iphones'>
              <Card.Img variant="top" src={iPhoneImage} />
              </Link>
              <Card.Body>
                <Card.Title>iPhone</Card.Title>
              </Card.Body>
            </Card>
            <Card>
            <Link to = '/macbooks'>
              <Card.Img variant="top" src={MacBookImage} />
              </Link>
              <Card.Body>
                <Card.Title>Macbook</Card.Title>
              </Card.Body>
            </Card>
            <Card>
            <Link to = '/iwatches'>
              <Card.Img variant="top" src={IWatchImage} />
              </Link>
              <Card.Body>
                <Card.Title>IWatch</Card.Title>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
      <Routes>
        <Route path="*" element={ <Navigate to="/shop" replace />} />
      </Routes>
    </Container>
    
  );
};

export default HomePage;
