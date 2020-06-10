require('dotenv').config();
import { ApolloServer } from 'apollo-server-express';
const express = require('express');
const session = require('express-session');
import mongoose from 'mongoose';
import { typeDefs, resolvers } from './schemas/index';

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: ({ req, res }) => ({ req, res })
  });

  mongoose.connect('mongodb+srv://admin:kiz2lnxS338wmJwJ@cluster0-ujwhx.mongodb.net/ketuker?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    audoIndex: true
  });

  const app = express();
  app.use(
    session({
      secret: 'asdjlfkaasdfkjlads',
      resave: false,
      saveUninitialized: false
    })
  );

  server.applyMiddleware({
    app,
    path: '/',
    cors: {
      credentials: true,
    }
  }); 
  const PORT = process.env.PORT || 4000;
  app.listen({ port:  PORT }, () => {
    console.log(PORT);
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();