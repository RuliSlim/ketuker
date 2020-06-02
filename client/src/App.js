import React from 'react';
import './App.css';
import { ApolloProvider } from '@apollo/react-hooks';
import client from './services/graphql';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Redirect
} from 'react-router-dom';
import {
  Register,
  Login,
  Home,
  Category,
  AddItem,
  DetailItemUser,
  DetailItemCustomer,
  User, 
  EditItem
} from './pages';
// import {
//   HeaderMain,
//   Navigation,
//   HeaderSecond,
// } from './components';
import Confirmation from './pages/Confirmation';


function App () {
  return (
    <ApolloProvider client={ client }>
      <Router>
            <Route exact path="/" component={ Home } />
            <Route path="/register" component={ Register } />
            <Route path="/login" component={ Login } />
            <Route path="/category=:cat" component={ Category } />
            <Route path="/barang/:id" component={ DetailItemCustomer } />
            {localStorage.getItem('token') && (
              <>
                <Route path="/additem" component={ AddItem} />
                <Route path="/me/barang/:id" component={ DetailItemUser } />
                <Route path="/my-profile" component={ User } />
                <Route path="/edit/:id" component={ EditItem } />
                <Route path="/konfirmasi" component={ Confirmation } />
                <Route path="/konfirmasi/:id" component={ Confirmation } />
              </>
            )}
      </Router>
    </ApolloProvider>
  );
} 

export default App;
