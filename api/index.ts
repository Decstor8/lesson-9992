import cors from 'cors';
import express from 'express';
import mongoose from "mongoose";
import config from "./config";
import expressWs from "express-ws";
import usersRouter from "./routers/users";

const app = express();
const port = 8000;
expressWs(app);

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);

const run = async () => {
    await  mongoose.connect(config.mongoose.db)

    app.listen(port, () => {
        console.log(`server started on ${port} port`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

void run();