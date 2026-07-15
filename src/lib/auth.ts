import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

// ১. গ্লোবাল ভেরিয়েবল সেট করা (যাতে Next.js হট-রিলোডে কানেকশন না হারায়)
const globalForMongo = global as unknown as {
  mongoClient?: MongoClient;
};

// ২. ক্লায়েন্ট চেক এবং তৈরি
const uri = process.env.MONGODB_URI as string;
if (!uri) {
  throw new Error('MONGODB_URI is not defined in .env');
}

const client = globalForMongo.mongoClient || new MongoClient(uri);

if (process.env.NODE_ENV !== 'production') {
  globalForMongo.mongoClient = client;
}

// ৩. ডাটাবেস ইন্সট্যান্স
const db = client.db('reusehub_db');

export const auth = betterAuth({
  // পরিবর্তন এখানে: শুধুমাত্র db ইন্সট্যান্স পাস করুন
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
      },
      plan: {
        type: 'string',
        defaultValue: 'free',
      },
    },
  },
});
