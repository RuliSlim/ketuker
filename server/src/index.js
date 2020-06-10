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
    cors: {
      credentials: true,
      origin: 'https://ketuker.herokuapp.com/'
    }
  }); 

  app.listen({ port: process.env.PORT || 4000 }, (url) =>
    console.log(`🚀 Server ready at ${url}`)
  );
};

startServer();