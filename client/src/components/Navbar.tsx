import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">mainpage</Link></li>
        <li><Link to="/runners">runners</Link></li>
        <li><Link to="/race_events">events</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
