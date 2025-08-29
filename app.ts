import express, { Request} from 'express';
import cors from 'cors';
import registerRoutes from './routes';

export const app = express();

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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});