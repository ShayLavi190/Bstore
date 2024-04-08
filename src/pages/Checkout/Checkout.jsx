import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import './checkout.css';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';

// Checkout component
const Checkout = ({ buyprod }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [CreditCardNumber, setCreditCardNumber] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [apt, setApt] = useState('');
  const [CVV, setCVV] = useState('');
  const [email, setEmail] = useState('');
  const [ValidDate, setValidDate] = useState(null);
  const [userData, setUserData] = useState({fullName: '', email: '', phone: '', address: {country: '', city: '', street: '', number: '', apt: ''}, creditCard: '', expiryDate: '', cvv: ''});
  const [zipcode, setZipcode] = useState('');
  const navigate = useNavigate();
  const [buyprodd, setBuyprodd] = useState([]);
  const location = useLocation();
  const [cartItems] = useState([]);
  useEffect(() => {
    if (location.state && location.state.buyprod) {
      setBuyprodd(location.state.buyprod);
    }
    if (!buyprodd) {
      console.log('No products in cart');
    }
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
    const userEmail = getCookie('email');
    if (userEmail) {
      fetchUserData(userEmail);
    }
  }, [buyprod, location]);
  
    
    useEffect(() => {
      setEmail(userData.email);
      setFullName(userData.full_name);
      setCountry(userData.address.country);
      setCity(userData.address.city);
      setStreet(userData.address.street);
      setNumber(userData.address.number);
      setZipcode(userData.address.zipcode);
    }, [userData]);
    // Function to fetch user data
    const fetchUserData = async (email) => {
      try {
        const response = await axios.get(`http://localhost:6500/${email}`);
        console.log('User data:', response.data.data);
        setUserData(response.data.data);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    // Function to generate a random string
    function generateRandomString() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let randomString = '';
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
      }
      return randomString;
    }
    // Function to handle payment
    const handlePayment = async () => {

      if (!fullName || !phone || !country || !city || !street || !number || !CreditCardNumber || !ValidDate || !CVV || !email) {
        alert('Please fill in all required fields.');
        return;
      }
      if (CVV.length !== 3) {
        alert('Please enter a valid CVV.');
        return;
      }
      const creditCardRegex = /^\d{16}$/;
      if (!creditCardRegex.test(CreditCardNumber)) {
        alert('Please enter a valid credit card number.');
        return;
      }
      const dayc = ValidDate.getDate().toString().padStart(2, '0');
      const monthc = (ValidDate.getMonth() + 1).toString().padStart(2, '0'); 
      const yearc = ValidDate.getFullYear().toString(); 
      const dateString = `${dayc}/${monthc}/${yearc}`
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
          console.log(dateString);
          alert('Please enter a valid date in the format DD/MM/YYYY.');
          return;
      }

    const selectedDate = new Date(yearc, monthc - 1, dayc); 

    const currentDate = new Date();

    if (selectedDate <= currentDate) {
        alert('Please select a date after the current date.');
        return;
    }
      const id = generateRandomString();
      try {
        const response = await axios.post('http://localhost:6500/order', {
          name: fullName,
          id:id,
          phone,
          email,
          ispaid: true, 
          address: {
            street,
            city,
            number,
            apt,
            country,
            zipcode
          },
          creditCard: CreditCardNumber,
          ValidDate:ValidDate,
          cvv: CVV,
          items: buyprodd
        });
        alert('Order submitted');
        var templateParams = {
          name: fullName,
          id: id,
          email: email,
        };
        emailjs.init("bVId8LXlgw6L9ZnIt");
        emailjs.send('order_conformation', 'order_c', templateParams).then(
          (response) => {
            console.log('SUCCESS!', response.status, response.text);
          },
          (error) => {
            console.log('FAILED...', error);
          },
        );
        try {
          for (const item of buyprodd) {
            const response = await axios.put(`http://localhost:6500/products/${item.prod_id}`, {
              isInStock: (item.quntity-item.ordered) > 0 
            });
      
            if (response.status === 200) {
              console.log(`Product ${item.prod_id} updated successfully.`);
            } else {
              console.error('Failed to update product:', response.data.message);
            }
          }
          
        } catch (error) {
          console.error('Error handling purchase:', error);
        }
        navigate('/shop');
      } catch (error) {
        console.error('Error submitting order:', error);
        alert('An error occurred while submitting the order. Please try again later.');
      }
    };
    
  return (
    <div>
    <Navbar />
      <h2>Checkout</h2>
      <form>
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <label htmlFor="fullName">Email:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="address">Country:</label>
        <input
          type="text"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <label htmlFor="address">City:</label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <label htmlFor="address">Street:</label>
        <input
          type="text"
          id="street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
        <label htmlFor="address">Number:</label>
        <input
          type="text"
          id="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <label htmlFor="address">Apartment:</label>
        <input
          type="text"
          id="apt"
          value={apt}
          placeholder='if there is no apartment number, leave it empty.'
          onChange={(e) => setApt(e.target.value)}
        />
        <label htmlFor="address">Zipcode:</label>
        <input
          type="text"
          id="zipcode"
          value={zipcode}
          placeholder=''
          onChange={(e) => setZipcode(e.target.value)}
        />
        <label htmlFor="phone">Phone:</label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label htmlFor="creditCard">Credit Card Number:</label>
        <input
          type="text"
          id="creditCard"
          value={CreditCardNumber}
          onChange={(e) => setCreditCardNumber(e.target.value)}
        />
        <label htmlFor="validDate">Valid date:</label>
        <DatePicker
          id="validDate"
          selected={ValidDate}
          onChange={(date) => setValidDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="DD/MM/YYYY"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          className="form-control" 
        />
        <input
          type="text"
          id="CVV"
          value={CVV}
          placeholder='3 digits on the back of your card.'
          onChange={(e) => setCVV(e.target.value)}
        />

        <button type="button" onClick={handlePayment}>
          Make a Payment
        </button>
      </form>
    </div>
  );
};

export default Checkout;
