import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
import './myorders.css'; 
import { Link } from 'react-router-dom';

// My ordesr page
const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
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
    const email = getCookie('email'); 
    if (email) {
      axios.get(`http://localhost:6500/orders?email=${email}`)
        .then((response) => setOrders(response.data.orders))
        .catch((error) => console.error(error));
    }
  }, []);

  return (
    <div>
      <Navbar />
      <nav>
        <ul>
          <li>
            <Link to="/personaldata">Personal Data</Link>
          </li>
          <li>
            <Link to="/myorders">My Orders</Link>
          </li>
        </ul>
      </nav>
      <div>
        {orders.map((order) => (
          <div key={order._id} className="card">
            <div className="card-body">
              <h5 className="card-title">Order ID: {order.id}</h5>
              <p className="card-text">Order Date: {order.date}</p>
              <h6>Items:</h6>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    <span>{item.name}</span> - <span>{item.quntity}</span> x <span className='items'>${item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
