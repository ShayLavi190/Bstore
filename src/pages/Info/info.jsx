import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
// PersonalInformation component
const PersonalInformation = () => {
const [full_name, setFull_name] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [country, setCountry] = useState('');
const [city, setCity] = useState('');
const [street, setStreet] = useState('');
const [number, setNumber] = useState('');
const [zipcode, setZipcode] = useState('');
const [userData, setUserData] = useState({full_name: '', email: '', password: '', address: {country: '', city: '', street: '', number: '', zipcode: ''}});
  const [editMode, setEditMode] = useState(false);

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
    const userEmail = getCookie('email');
    if (userEmail) {
      fetchUserData(userEmail);
    }
  }, []);
  
// Function to fetch user data from the database
const fetchUserData = async (email) => {
  try {
    const response = await axios.get(`http://localhost:6500/${email}`);
    const userData = response.data.data; 
    setUserData(userData);
    setFull_name(userData.full_name);
    setEmail(userData.email);
    setPassword(userData.password);
    setCountry(userData.address.country);
    setCity(userData.address.city);
    setStreet(userData.address.street);
    setNumber(userData.address.number);
    setZipcode(userData.address.zipcode);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

//  Function to handle the edit click
  const handleEditClick = () => {
    setEditMode(true);
  };
// Function to handle the save click
  const handleSaveClick = async () => {
    try {
        setUserData({full_name, email, password, address: {country, city, street, number, zipcode}});
      await axios.put(`http://localhost:6500/user/${userData.email}`, userData);
      alert('User data updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
// Function to handle the input change
const handleInputChange = (e) => {
  const { name, value } = e.target;
  if (name === 'address' || name === 'country' || name === 'city' || name === 'street' || name === 'number' || name === 'zipcode') {
    setUserData(prevUserData => ({
      ...prevUserData,
      address: {
        ...prevUserData.address,
        [name]: value
      }
    }));
  } else {
    setUserData(prevUserData => ({
      ...prevUserData,
      [name]: value
    }));
  }
};


return (
  <div style={{marginTop : '80px'}}>
    <Navbar />
    <div>
      <h1>Personal Information</h1>
      <div>
        <form>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={userData.full_name || ''}
            onChange={handleInputChange}
            disabled={!editMode}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={userData.email || ''}
            onChange={handleInputChange}
            disabled={!editMode}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="text"
            id="password"
            name="password"
            value={userData.password || ''}
            onChange={handleInputChange}
            disabled={!editMode}
          />
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            name="country"
            value={userData.address ? userData.address.country || '' : ''}
            onChange={handleInputChange}
            disabled={!editMode}
          />
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={userData.address ? userData.address.city || '' : ''}
            onChange={handleInputChange}
            disabled={!editMode}
          />
          <label htmlFor="street">Street:</label>
          <input
            type="text"
            id="street"
            name="street"
            value={userData.address ? userData.address.street || '' : ''}
            onChange={handleInputChange}
            disabled={!editMode}
          />
          <label htmlFor="number">Number:</label>
          <input
            type="text"
            id="number"
            name="number"
            value={userData.address ? userData.address.number || '' : ''}
            onChange={handleInputChange}
            disabled={!editMode}
          />
          <label htmlFor="zipcode">Zipcode:</label>
          <input
            type="text"
            id="zipcode"
            name="zipcode"
            value={userData.address ? userData.address.zipcode || '' : ''}
            onChange={handleInputChange}
            disabled={!editMode}
          />
        </form>
        {editMode ? (
          <button onClick={handleSaveClick}>Save</button>
        ) : (
          <button onClick={handleEditClick}>Edit</button>
        )}
      </div>
    </div>
  </div>
);
};

export default PersonalInformation;
