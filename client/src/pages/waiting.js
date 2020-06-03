import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderMain, Navigation, CompLoading, CompError } from '../components';
import { useQuery } from '@apollo/react-hooks';
import { GET_USER } from '../services/schema';

export default function Success () {
  const { loading, error, data } = useQuery(GET_USER, { variables: { id: localStorage.getItem('userOriginal') } });

  if(loading) {
    return <CompLoading />;
  }

  if(error) {
    return <CompError />;
  }

  if(data) {
    return (
      <>
        <HeaderMain />
        <Navigation />
        <div className="success-container">
          <div className="success-message">
            <h1>Waiting</h1>
            <p>Menunggu {data.getUser.username.toUpperCase()} untuk merespons.</p>
            <p>Cek status permintaan barter Anda di halaman user di <Link to="/my-profile">sini!</Link></p>
            <Link to="/">
              <button>Back To Home</button>
            </Link>
          </div>
        </div>
      </>
    );
  }
}