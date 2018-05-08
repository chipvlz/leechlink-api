import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Fshare } from './impl/fshare';
import { DWorker } from './worker';
import { HostType } from './util/conts';
import { DAccount } from './models/account';
const accounts: DAccount[] = require('../src/files/accs.json').accounts;

const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const geters = new DWorker(accounts);
geters.run();

app.get('/pf/:code', async (req, res) => {
    const code = req.params.code;
    const info = await geters.get(code);
    res.json(info);
});

app.listen(port, () => console.log(`Server is starting at ${port}`));