import express, { Request, Response } from 'express';
import cors from 'cors'
import routes from './routes/routes';
import bodyParser from 'body-parser';
import HttpException from './models/http-exception.model';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
