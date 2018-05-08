import { DAccount } from "../models/account";
import { IGet } from "../interfaces/iget.interface";
import { HostType } from "../util/conts";
import { Fshare } from "../impl/fshare";
import { hostname } from "os";
import { Dlink } from "../models/dlink";
import { LinksVip } from "../impl/linksvip";

export class DWorker {
    _accounts: DAccount[] = [];
    _getlinkers: IGet[] = [];
    _round = 0;

    constructor(accounts: DAccount[]) {
        this._accounts = accounts;
    }

    // Will login all accouns
    run() {
        this._accounts.forEach(acc => {
            switch (acc.type) {
                case HostType.Fshare: this._getlinkers.push(new Fshare(acc)); break;
                case HostType.LinksVip: this._getlinkers.push(new LinksVip(acc)); break;
            }
        });

        this._getlinkers.forEach(iget => {
            iget.login()
                .then(_ => console.log(`Logging in... by account: ${iget.accountInfo().email}`));
        });
    }

    //Get
    get(code: string): Promise<Dlink> {
        const geter = this._getlinkers[this._round % this._getlinkers.length];
        this._round += 1;
        return geter.dlink(code);
    }
}