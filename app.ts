import dotenv from 'dotenv';
import express, { Request} from 'express';
import cors from 'cors';
import registerRoutes from './routes';

// Load env only in dev (not needed in prod containers if envs are passed directly)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());

// Enable CORS for all methods
app.use((req: Request, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

registerRoutes(app);

app.get('/', async (req, res) => {
    res.send('API is running...');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});