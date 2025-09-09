import dotenv from 'dotenv';
import express, { Request} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import registerRoutes from './routes';
import { executeQuery } from './utilities/db-queries';

// Load env only in dev (not needed in prod containers if envs are passed directly)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const app = express();

const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Enable CORS for all methods
app.use((req: Request, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

registerRoutes(app);



// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const query = `SELECT NOW()`;
    const result = await executeQuery(query);
    res.status(200).json({
      status: 'healthy',
      timestamp: result.rows[0].now,
      database: 'connected'
    });
  } catch (error:any) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});