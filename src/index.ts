import express, {Request, Response} from 'express';
import {MongoClient, InsertOneResult, Document} from 'mongodb';

const app = express();
const port = 3000;
const mongoURL = `mongodb://${process.env.MONGO_HOST || "localhost"}:27017`;
const dbName = 'mydb';
const collectionName = 'textInputs';

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Connect to MongoDB
MongoClient.connect(mongoURL, {serverSelectionTimeoutMS: 100})
    .then(client => {
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        const collection = db.collection<Document>(collectionName);

        // Render the index page with stored inputs
        app.get('/', (req: Request, res: Response) => {
            collection.find().toArray()
                .then((inputs: Document[]) => {
                    res.render('index', {inputs});
                })
                .catch((err: Error) => {
                    console.error('Failed to retrieve text inputs:', err);
                    res.status(500).render('error', {message: 'Failed to retrieve text inputs'});
                });
        });

        // Store a new text input
        app.post('/inputs', (req: Request, res: Response) => {
            const {text} = req.body;

            collection.insertOne({text})
                .then((result: InsertOneResult<Document>) => {
                    res.redirect('/');
                })
                .catch((err: Error) => {
                    console.error('Failed to store text input:', err);
                    res.status(500).render('error', {message: 'Failed to store text input'});
                });
        });

        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((err: Error) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });
