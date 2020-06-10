import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://ketuker.herokuapp.com/',
  request: (operation) => {
    const userToken = localStorage.getItem('token');
    operation.setContext({
      headers: {
        token: userToken ? userToken : ''
      }
    }); 
  }
});

export default client;