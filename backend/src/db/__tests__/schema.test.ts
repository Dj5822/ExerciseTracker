import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User, Exercise } from '../schema';

let mongod: any;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    const connectionString = mongod.getUri();
    await mongoose.connect(connectionString);
});

const users = [
    { _id: new mongoose.Types.ObjectId('000000000000000000000001'), username: 'testUser1' },
    { _id: new mongoose.Types.ObjectId('000000000000000000000002'), username: 'testUser2' },
    { _id: new mongoose.Types.ObjectId('000000000000000000000003'), username: 'testUser3' }
]

const exercises = [
    { _id: new mongoose.Types.ObjectId('000000000000000000000001'), 
    userId: new mongoose.Types.ObjectId('000000000000000000000001'),
    name: "push ups",
    quantity: 200,
    date: new Date()},
    { _id: new mongoose.Types.ObjectId('000000000000000000000002'), 
    userId: new mongoose.Types.ObjectId('000000000000000000000001'),
    name: "pull ups",
    quantity: 100,
    date: new Date()},
    { _id: new mongoose.Types.ObjectId('000000000000000000000003'), 
    userId: new mongoose.Types.ObjectId('000000000000000000000002'),
    name: "handstand pushups",
    quantity: 10,
    date: new Date()},
    { _id: new mongoose.Types.ObjectId('000000000000000000000004'), 
    userId: new mongoose.Types.ObjectId('000000000000000000000002'),
    name: "muscle up",
    quantity: 10,
    date: new Date()},
    { _id: new mongoose.Types.ObjectId('000000000000000000000005'), 
    userId: new mongoose.Types.ObjectId('000000000000000000000003'),
    name: "push ups",
    quantity: 500,
    date: new Date()},
]

beforeEach(async () => {
    // clear the database
    await mongoose.connection.db.dropDatabase();

    const userCollection = await mongoose.connection.db.createCollection('users');
    const exerciseCollection = await mongoose.connection.db.createCollection('exercises');

    await userCollection.insertMany(users);
    await exerciseCollection.insertMany(exercises);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

it('should get all the users.', async () => {
    const result = await User.find();

    for (var i=0; i<result.length; i++) {
        expect(result[i].username).toBe(users[i].username);
    }
})

it('should get all the correct user.', async () => {
    const result: any = await User.findById(new mongoose.Types.ObjectId('000000000000000000000001'));

    expect(result.username).toBe(users[0].username);
})

it('should return null for invalid users.', async () => {
    const result = await User.findById(new mongoose.Types.ObjectId('000000000000000000000009'));

    expect(result).toBeFalsy();
})

it('should get all the exercises', async () => {
    const result = await Exercise.find();

    for (var i=0; i<result.length; i++) {
        expect(result[i].userId).toStrictEqual(String(exercises[i].userId));
        expect(result[i].name).toBe(exercises[i].name);
        expect(result[i].quantity).toBe(exercises[i].quantity);
        expect(result[i].date).toStrictEqual(exercises[i].date);
    }
})

it('should get the correct exercise.', async () => {
    const result: any = await Exercise.findById(new mongoose.Types.ObjectId('000000000000000000000001'));

    expect(result.userId).toStrictEqual(String(exercises[0].userId));
    expect(result.name).toBe(exercises[0].name);
    expect(result.quantity).toBe(exercises[0].quantity);
    expect(result.date).toStrictEqual(exercises[0].date);
})

it('should return null for invalid exercises.', async () => {
    const result = await Exercise.findById(new mongoose.Types.ObjectId('000000000000000000000009'));

    expect(result).toBeFalsy();
})