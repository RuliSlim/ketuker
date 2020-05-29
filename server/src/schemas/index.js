import { gql } from 'apollo-server';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import redis from '../utilities/redis';
import User from '../models/User';
import Product from '../models/Product';
import { authen } from '../utilities/authenticagtion';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    avatar: String!
    address: String!
    phone: String!
    token: String
  }

  input UserLogin {
    email: String!
    password: String!
  }

  input UserRegister {
    username: String!
    email: String!
    password: String!
    avatar: String!
    address: String!
    phone: String!
  }

  type Product {
    id: ID!
    userId: String!
    title: String!
    description: String!
    price: Int!
    whislist: String!
    category: String!
    image: String!
    submit: Boolean!
  }

  input InputProduct {
    title: String!
    description: String!
    price: Int!
    whislist: String!
    category: String!
    image: String!
    submit: Boolean!
  }

  type Output {
    result: String!
  }

  type Query {
    getUsers: [User]!
    getUser(id: ID!): User!

    getProducts: [Product]!
    getProduct(id: ID!): Product!
  }

  type Mutation {
    register(input: UserRegister): User!
    login(input: UserLogin): User!

    addProduct(input: InputProduct!): Product!
    updateProduct(id: ID!, input: InputProduct!): Output!
    deleteProduct(id: ID!): Output!
  }
`;

export const resolvers = {
  Query: {
    getUsers: async () => {
      const checkUsers = JSON.parse(await redis.get('users'));

      if (checkUsers) {
        return checkUsers;
      } else {
        const getAllUsers = await User.find();
        await redis.set('users', JSON.stringify(getAllUsers));
        return getAllUsers;
      }
    },
    getUser: async (_, { id }) => {
      try {
        const users = JSON.parse(await redis.get('users'));
        const user = users.filter(el => el._id == id);
        if (user.length) {
          const [ data ] = user;
          return data;
        } else {
          const getOneUser = await User.findOne({ _id: id });
          users.push(getOneUser);
          await redis.set('users', JSON.stringify(users));
          return getOneUser;
        }
      } catch (e) {
        return new Error('User not found!');
      }
    },

    getProducts: async () => {
      // await redis.del('products');
      const getProducts = JSON.parse(await redis.get('products'));
      if (getProducts) {
        return getProducts;
      } else {
        const getAllProducts = await Product.find();
        await redis.set('products', JSON.stringify(getAllProducts));
        return getAllProducts;
      }
    },
    getProduct: async (_, { id }) => {
      const products = JSON.parse(await redis.get('products'));
      const product = products.filter(el => el._id == id);
      if (product.length) {
        return product;
      } else {
        const getOneProduct = await Product.findOne({ _id: id });
        products.push(getOneProduct);
        redis.set('products', JSON.stringify(products));
        return getOneProduct;
      }
    },
  },
  Mutation: {
    register: async (_, { input }) => {
      const { email } = input;
      const newUser = new User(input);
      const error = newUser.validateSync();
      if (error) {
        if (error.errors.password) {
          throw new Error (error.errors.password.properties.message);
        } else {
          throw new Error (error.errors.phone.properties.message);
        }
      } else {
        const res = await newUser.save();
        const token = jwt.sign({ email }, 'rahasia');
        return { id: res._id, ...res._doc, token };
      }
    },
    login: async (_, { input }) => {
      await redis.flushall();
      const { email, password } = input;
      const getUser = await User.findOne({ email });
      if (getUser) {
        const compare = await bcrypt.compare(password, getUser.password);
        if (!compare) {
          throw new Error ('Wrong Password / Wrong Email');
        } else {
          //kalo secretPrivateKey gw taruh di .env masih error. sementara gtu.
          const token = jwt.sign({ email }, 'rahasia');
          await redis.set('token', token);
          const { _id, username, email, avatar, address, phone } = getUser;
          return {
            id: _id,
            username,
            avatar,
            address,
            phone,
            email,
            token
          };
        }
      } else {
        throw new Error ('Wrong Password / Wrong Email');
      }
    },

    addProduct: async (_, { input }, { req }) => {
      const { title, description, price, whislist, category, image, submit } = input;
      const { token } = req.session;

      const userAuth = await authen(token);
      const user = await User.findOne({ email: userAuth.email });
      if (!user) throw new Error('You have to login');
      const newProduct = new Product({
        title,
        description,
        price,
        whislist,
        category,
        image,
        submit,
      });
      newProduct.userId = user._id;
      await newProduct.save();
      const getAllProducts = await Product.find();
      await redis.set('products', JSON.stringify(getAllProducts));

      return newProduct;
    },
    updateProduct: async (_, { id, input }) => {
      await redis.del('products');
      const { title, description, price, whislist, category, image, submit } = input;
      const updateProduct = await Product.findOne({ _id: id });

      updateProduct.title = title;
      updateProduct.description = description;
      updateProduct.price = price;
      updateProduct.whislist = whislist;
      updateProduct.category = category;
      updateProduct.image = image;
      updateProduct.submit = submit;

      await updateProduct.save();
      const getAllProducts = await Product.find();
      await redis.set('products', JSON.stringify(getAllProducts));

      return {
        result: 'Successfully updated product!',
      };
    },
    deleteProduct: async (_, { id }) => {
      await redis.del('products');
      await Product.deleteOne({ _id: id });

      const getAllProducts = await Product.find();
      await redis.set('products', JSON.stringify(getAllProducts));
      return {
        result: 'Successfully deleted product!',
      };
    },
  },
};
