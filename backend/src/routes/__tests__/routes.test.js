import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import router from '../';
import axios from 'axios';
import { User, Exercise } from '../../db/schema';

let mongod, server;

beforeAll(async() => {
    mongod = await MongoMemoryServer.create();

    const connectionString = mongod.getUri();
    await mongoose.connect(connectionString, { useNewUrlParser: true});

    const app = express();
    app.use(express.json());
    app.use('/api', router);
    server = app.listen(3000, () => null);
});

beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

    const userCollection = await mongoose.connection.db.createCollection('users');
    const exerciseCollection = await mongoose.connection.db.createCollection('exercises');

    await userCollection.insertMany(users);
    await exerciseCollection.insertMany(exercises);
});

afterAll(done => {
    server.close(async () => {
        await mongoose.disconnect();
        await mongod.stop();

        done();
    });
});

const users = [
    { _id: new mongoose.Types.ObjectId('000000000000000000000001'), username: 'testUser1' },
    { _id: new mongoose.Types.ObjectId('000000000000000000000002'), username: 'testUser2' },
    { _id: new mongoose.Types.ObjectId('000000000000000000000003'), username: 'testUser3' }
]

const exercises = [
    { _id: new mongoose.Types.ObjectId('000000000000000000000001'), 
    userId: '000000000000000000000001',
    name: "push ups",
    quantity: 200,
    date: new Date('1995-12-17T03:24:00')},
    { _id: new mongoose.Types.ObjectId('000000000000000000000002'), 
    userId: '000000000000000000000001',
    name: "pull ups",
    quantity: 100,
    date: new Date('1999-12-17T03:24:00')},
    { _id: new mongoose.Types.ObjectId('000000000000000000000003'), 
    userId: '000000000000000000000001',
    name: "handstand pushups",
    quantity: 10,
    date: new Date('2001-12-17T03:24:00')},
    { _id: new mongoose.Types.ObjectId('000000000000000000000004'), 
    userId: '000000000000000000000001',
    name: "muscle up",
    quantity: 10,
    date: new Date('2006-12-17T03:24:00')},
    { _id: new mongoose.Types.ObjectId('000000000000000000000005'), 
    userId: '000000000000000000000001',
    name: "push ups",
    quantity: 500,
    date: new Date('2011-12-17T03:24:00')},
]

it('should able to add a new user successfully', async() => {
    const response = await axios.post('http://localhost:3000/api/users', {"username": "newUser"});

    expect(response.status).toBe(201);

    const result = await User.find();

    expect(result.length).toBe(4);
});

it('should return 404 when user is created with no username', async() => {
    try {
        const response = await axios.post('http://localhost:3000/api/users');

        expect(response.status).toBe(404);

        const result = await User.find();

        expect(result.length).toBe(3);
    }
    catch (err) {
        expect(err.code).toBe("ERR_BAD_REQUEST");
    }
})

it('gets all users successfully', async() => {
    const response = await axios.get('http://localhost:3000/api/users')

    expect(response.status).toBe(200);
    for (var i=0; i<response.length; i++) {
        expect(response[i].userId).toStrictEqual(String(exercises[i].userId));
        expect(response[i].name).toBe(exercises[i].name);
        expect(response[i].quantity).toBe(exercises[i].quantity);
        expect(response[i].date).toStrictEqual(exercises[i].date);
    }
})

it('should able to add a new exercise successfully', async() => {
    const response = await axios.post('http://localhost:3000/api/users/000000000000000000000001/exercises', 
    {"name": "pushups", "quantity": 100, "date": new Date()});

    expect(response.status).toBe(201);

    const result = await Exercise.find();

    expect(result.length).toBe(6);
});

it('should fail to add a new exercise when invalid user id is given.', async() => {
    try {
        const response = await axios.post('http://localhost:3000/api/users/000000000000000000000009/exercises', 
        {"name": "pushups", "quantity": 100, "date": new Date()});

        expect(response.status).toBe(404);

        const result = await Exercise.find();

        expect(result.length).toBe(5);
    }
    catch (err) {
        expect(err.code).toBe("ERR_BAD_REQUEST");
    }
});

it('should fail to add a new exercise when invalid request body is missing.', async() => {
    try {
        const response = await axios.post('http://localhost:3000/api/users/000000000000000000000009/exercises');

        expect(response.status).toBe(400);

        const result = await Exercise.find();

        expect(result.length).toBe(5);
    }
    catch (err) {
        expect(err.code).toBe("ERR_BAD_REQUEST");
    }
});

it('should get exercise logs of a user', async() => {
    const response = await axios.get('http://localhost:3000/api/users/000000000000000000000001/logs');

    expect(response.status).toBe(200);
    expect(response.data.username).toBe(users[0].username);
    expect(response.data.count).toBe(5);

    for (var i=0; i<response.data.log.length; i++) {
        expect(response.data.log[i].name).toBe(exercises[i].name);
        expect(response.data.log[i].quantity).toBe(exercises[i].quantity);
        expect(response.data.log[i].date).toBe(exercises[i].date.toDateString());
    }
})

it('should fail to get exercise logs of an non-existent user', async() => {
    try {
        const response = await axios.get('http://localhost:3000/api/users/000000000000000000000009/logs');

        expect(response.status).toBe(404);
    }
    catch (err) {
        expect(err.code).toBe("ERR_BAD_REQUEST");
    }
})