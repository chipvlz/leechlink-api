import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Fshare } from './impl/fshare';

const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/pf/:code', async (req, res) => {
    const code = req.params.code;
    const info = await new Fshare().getInfo(code);

    res.json(info);
});

app.listen(port, () => console.log(`Server is starting at ${port}`));