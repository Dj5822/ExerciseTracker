import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User, Exercise } from '../schema';

let mongod;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    const connectionString = mongod.getUri();
    await mongoose.connect(connectionString, { useNewUrlParser: true});
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
    const result =- await User.find();

    for (var i=0; i<result.length; i++) {
        expect(result[i].username).toBe(users[i].username);
    }
})