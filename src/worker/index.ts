import { DAccount } from "../models/account";
import { IGet } from "../interfaces/iget.interface";
import { HostType } from "../util/conts";
import { Fshare } from "../impl/fshare";
import { hostname } from "os";
import { Dlink } from "../models/dlink";

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
            if (acc.type === HostType.Fshare) {
                this._getlinkers.push(new Fshare(acc));
            }
        });

        this._getlinkers.forEach(iget => {
            console.log(`Login by account: ${iget.accountInfo().email}`);
            iget.login();
        });
    }

    //Get
    get(code: string): Promise<Dlink> {
        const geter = this._getlinkers[this._round % this._getlinkers.length];
        if (geter.accountInfo().type === HostType.Fshare) {
            this._round += 1;
            return geter.dlink(code);
        } else {
            this._round += 1;
            this.get(code);
        }
        this._round += 1;
    }
}