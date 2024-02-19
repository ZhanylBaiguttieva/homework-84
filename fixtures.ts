import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import Task from "./models/Task";

const dropCollection  = async (db: mongoose.Connection, collectionName: string) => {
    try {
        await db.dropCollection(collectionName);
    } catch (e) {
        console.log(`Collection ${collectionName} was missing, skipping drop...`);
    }
}
const run = async () => {
    await mongoose.connect(config.mongoose.db);
    const db  = mongoose.connection;
    const collections = ['users', 'tasks'];

    for (const collectionName of collections) {
        await dropCollection(db, collectionName);
    }

    const [user1, user2] = await User.create(
        {
            username:  'Jana2',
            password: '456',
            token: crypto.randomUUID(),
        }, {
            username:  'Jana3',
            password: '789',
            token: crypto.randomUUID(),
        },
    );
    await Task.create({
            user: user1,
            title: 'Make dinner',
            description: 'Before 11:00 AM',
            status: 'new',
        }, {
            user: user2,
            title: 'Wash dishes',
            description: 'Till morning',
            status: 'in_progress',
        }
    );

    await db.close();
};

void run();