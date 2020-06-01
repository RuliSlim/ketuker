import React from 'react';
import logo from '../assets/images/logo.png';
import avatar from '../assets/images/avatar.png';
import { Link, useHistory } from 'react-router-dom';

export default function HeaderMain () {

  const history = useHistory();

  function ToUploadBarang () {
    history.push('/additem'); 
  }

  return (
    <div className="header-container">
      <Link to="/">
        <div className="logo-container">
          <img src={logo} alt="logo" />
        </div>
      </Link>
      <div className="header-search-container">
        <input type="text" placeholder="cari barang lalu tekan enter" />
      </div>
      <div className="header-user-container">
        <button onClick={ToUploadBarang}>Upload Barang</button>
        <Link to={ localStorage.getItem('token') ? '/my-profile' : '/login' }>
          <img src={avatar} alt="avatar" />
        </Link>
      </div>
    </div>
  );
}