/* eslint-disable no-undef */
import 'babel-polyfill';
import { setUpTest } from './helper/helper';
import { graphqlTestCall } from './utils/graphqlTestCall';

const registerMutation = `
  mutation registerUser($input: UserRegister) {
    register(input:$input) {
      token
      username
      _id
    }
  }
`;


const loginMutation = `
  mutation loginUser($input: UserLogin) {
    login(input: $input) {
      token
      username
      _id
    }
  }
`;

const allUserQuery = `
  query allUser {
    getUsers {
      username
    }
  }
`;

const getUserQuery = `
  query getUser($id: ID!) {
    getUser(id: $id) {
      username
    }
  }
`;

let existId;
beforeAll(async () => await setUpTest());

describe('Test Mutation User', () => {
  it('It should not create user, password too short', async () => {
    const user = {
      username: 'almasfikri',
      email: 'almas@fikri.com',
      password: 'jan',
      avatar: 'image.jpg',
      address: 'Surabaya, Indonesia',
      phone: '082256479787',
    };
    const input = user;
    const res = await graphqlTestCall(registerMutation, { input } );
    const { errors: [ { message } ] } = res;
    expect(message).not.toBeNull();
  });

  it('It should create User', async () => {
    const user = {
      username: 'almasfikri',
      email: 'almas@fikri.com',
      password: 'jancok123',
      avatar: 'image.jpg',
      address: 'Surabaya, Indonesia',
      phone: '082256479787',
      city: 'Jakarta'
    };
    const input = user;
    const res = await graphqlTestCall(registerMutation, { input } );
    const { data: { register: { username } } } = res;
    const { data: { register: { _id } } } = res;
    existId = _id;
    expect(username).not.toBeNull();
  });

  it('It should not create User, duplicate key', async () => {
    const user = {
      username: 'almasfikri',
      email: 'almas@fikri.com',
      password: 'jancok123',
      avatar: 'image.jpg',
      address: 'Surabaya, Indonesia',
      phone: '082256479787',
    };
    const input = user;
    const res = await graphqlTestCall(registerMutation, { input } );
    const { errors: [ { message } ] } = res;
    expect(message).not.toBeNull();
  });

  it('It should not login, password wrong', async () => {
    const user = {
      email: 'almas@fikri.com',
      password: '123'
    };
    const input = user;
    const res = await graphqlTestCall(loginMutation, { input });
    const { errors: [ { message } ] } = res;
    expect(message).not.toBeNull();
  });

  it('It should not login, email wrong', async () => {
    const user = {
      email: 'asdad@csac.com',
      password: 'jancok123'
    };
    const input = user;
    const res = await graphqlTestCall(loginMutation, { input });
    const { errors: [ { message } ] } = res;
    expect(message).not.toBeNull();
  });

  it('It should login existed user', async () => {
    const user = {
      email: 'almas@fikri.com',
      password: 'jancok123'
    };
    const input = user;
    const res = await graphqlTestCall(loginMutation, { input });
    const { data: { login: { username } } } = res;
    expect(username).not.toBeNull();
  });
});

describe('Test Query User', () => {
  it('It should getAll existed user', async () => {
    const res = await graphqlTestCall(allUserQuery, {});
    const { data: { getUsers: [ { username } ] } } = res;
    expect(username).not.toBeNull();
  });

  it('It should getUser user', async () => {
    const res = await graphqlTestCall(getUserQuery, { id: existId });
    const { data: { getUser: { username } } } = res;
    expect(username).not.toBeNull();
  });

  it('It should not getUser, wrong id', async () => {
    const res = await graphqlTestCall(getUserQuery, { id: 'id asal' });
    const { errors: [ { message } ] } = res;
    expect(message).not.toBeNull();
  });
});
