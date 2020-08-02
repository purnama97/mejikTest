require("dotenv").config();
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
const jwt = require("jsonwebtoken");
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import compression from 'compression';
import mongoose from 'mongoose';
import cors from 'cors';
import schema from './schema';

const app = express();

const dbServer = "mongodb://localhost:27017/chatime";
const connect = mongoose.connect(dbServer, { useUnifiedTopology: true, useNewUrlParser: true } )
connect.then((db) => {
    console.log('Connected correctly to database server!');
}, (err) => {
    console.log(err);
});

const server = new ApolloServer({
  schema,
  context:({ req }) => {
    let header, token;
    if(
        !(header =req.headers.authorization) ||
        !(token = header.replace("Bearer ", ""))
    ) {
        null
    }else{

        const verified = jwt.verify(token, process.env.SECRET_KEY);
        const user = verified;
    
        return { user };
    }
  },

  validationRules: [depthLimit(7)],
});


app.use('*', cors());
app.use(compression());

server.applyMiddleware({ app, path: '/chatime' });
const httpServer = createServer(app);

httpServer.listen({ port: 5000 }, (): void => console.log(`GraphQL is now running on http://localhost:5000/chatime`));