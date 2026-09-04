// src/components/navigations/Footer.js
import React from 'react';
import logo from "../../integritylogo.webp";


const Footer = () => {
  return (
      <footer>
          <p style={{
              display: "inline-block"
          }}>
              <img src={logo} alt="logo" width={25} height={25}/>
              © 2024 GNU Software License
          </p>

      </footer>
  );
};

export default Footer;
