import React from "react";
import axios from "axios";
// Register component to display the registration form
function Register() {
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: "",
    country: "",
    city: "",
    street: "",
    number: "",
    apt: ""
  });
  // Handel changes on the inputs
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setState({
      ...state,
      [name]: value
    });
  };
  // check for password that contain symbols
  const passwordContainsSymbols = (password) => {
    const symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', '[', ']', '{', '}', ';', ':', "'", '"', '\\', '|', ',', '.', '<', '>', '/', '?'];
    return symbols.some(symbol => password.includes(symbol));
  };
  // check for password that contain numbers
  const passwordContainsnNumbers = (password) => {
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return numbers.some(number => password.includes(number));
  };
  // Function to handle the form submit
  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    if(!state.name || !state.email || !state.password || !state.country || !state.city || !state.street || !state.number ||!state.apt) return alert("Please fill in all fields. if you don't have an apartment number, please fill in 0.")
    if((state.password.length < 8) ) return alert("Password must be at least 8 characters long.")
    if(!passwordContainsSymbols(state.password)) return alert("Password must contain at least one symbol.")
    if((state.number < 0) || (state.apt < 0)) return alert("Apartment number and street number must be positive numbers.")
    if(!passwordContainsnNumbers(state.password)) return alert("Password must contain numbers.")
    try{const user = await axios.get(`http://localhost:6500/${state.email}`);
    if(user) return alert("User already exists, please log in.")
    return;
  }
    catch (error) {
      console.error("Error:", error);
    }
    try {
      const response = await axios.post("http://localhost:6500/register", {
        full_name: state.name,
        email: state.email,
        password: state.password,
        address: {
          country: state.country,
          city: state.city,
          street: state.street,
          number: state.number,
          apt: state.apt
        }
      });
      setState({
        name: "",
        email: "",
        password: "",
        country: "",
        city: "",
        street: "",
        number: "",
        apt: ""
      });
      alert("User created successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1 className="titleb">Create Account</h1>
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <input
          type="text"
          name="country"
          value={state.country}
          onChange={handleChange}
          placeholder="Country"
        />
        <input
          type="text"
          name="city"
          value={state.city}
          onChange={handleChange}
          placeholder="City"
        />
        <input
          type="text"
          name="street"
          value={state.street}
          onChange={handleChange}
          placeholder="Street"
        />
        <input
          type="text"
          name="number"
          value={state.number}
          onChange={handleChange}
          placeholder="Apartment Number"
        />
        <input
          type="text"
          name="apt"
          value={state.apt}
          onChange={handleChange}
          placeholder="Apt (if applicable - if not, fill in 0)"
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Register;
