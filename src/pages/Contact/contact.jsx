import React, { useState } from "react";
import Navbar from "../../components/navbar";
import "./contact.css";
import emailjs from '@emailjs/browser';
import { useEffect } from "react";

// Contact component
export const Contact = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => emailjs.init("bVId8LXlgw6L9ZnIt"), [])
  const handleSubmit = async (e) => {
    e.preventDefault();
    const serviceId = "bstorecontact";
    const templateId = "template_n389dr4";
    try {
      await emailjs.send(serviceId, templateId, {
       name: name,
        email: email,
        phone: phone,
        description: description,

      });
      alert("email successfully sent check inbox");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{marginTop : '80px'}}>
      <Navbar />
      <h1 className="contact-title">Contact Us</h1>
      <div className="contact-container">
        <form onSubmit={handleSubmit}>
          <div className="contact-form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="contact-form-group">
            <label>Phone:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="contact-form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="contact-form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="contact-form-group">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
