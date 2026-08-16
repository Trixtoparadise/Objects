import 'dotenv/config';
import express, {type Express} from 'express';
import landmark_router from './routes/landmark_routes.ts';

const app: Express = express();

app.use(express.json());

(BigInt.prototype as any).toJSON = function () {
    return this.toString()
};

app.use('/api', landmark_router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server executing live parameters on port ${PORT}`);
});