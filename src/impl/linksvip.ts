import { IGet } from "../interfaces/iget.interface";
import { FileInfo } from "../models/fileinfo";
import { Dlink } from "../models/dlink";
import { DAccount } from "../models/account";
import * as request from 'request';
import { defaulLinksViptHeader, HostType } from "../util/conts";
import { codeToUrl, cookieToObj } from "../util/util";
const uid = require('uid');

export class LinksVip implements IGet {

    _account: DAccount;
    _loggedCookies: string[];
    _preCookie: string;

    private readonly _HOMEPAPGE = 'https://linksvip.net/';
    private readonly _LOGIN = 'https://linksvip.net/login/';
    private readonly _GETLINK = 'https://linksvip.net/GetLinkFs';

    constructor(account: DAccount) {
        this._account = account;
    }

    getInfo(code: string): Promise<FileInfo> {
        throw new Error("Method not implemented.");
    }

    login(): Promise<boolean> {
        return this.preLogin().then(rs => {

            const formData = {
                'u': `${this._account.email}`,
                'p': `${this._account.password}`,
                'auto_login': `checked`
            }

            const options = {
                headers: Object.assign({}, defaulLinksViptHeader, { 'Cookie': rs.cookie }),
                formData: formData
            }

            request.post(this._LOGIN, options, (err, res, body) => {
                const cookies = res.headers['set-cookie']
                this._loggedCookies = cookies;
                this._loggedCookies.push(rs.cookie);
                console.log(this._loggedCookies);
            });
            return true;
        });
    }

    dlink(code: string): Promise<Dlink> {
        const formData = {
            link: codeToUrl(code, HostType.Fshare),
            pass: cookieToObj(this._loggedCookies[1]).pass,
            hash: uid(),
            captcha: ''
        }

        const options = {
            headers: Object.assign({}, defaulLinksViptHeader,
                { 'Cookie': this._loggedCookies.join(';'), 'X-Requested-With': 'XMLHttpRequest' }),
            formData: formData
        }

        return new Promise((resolve, reject) => {
            request.post(this._GETLINK, options, (err, res, body) => {
                let result = JSON.parse(body);
                resolve({
                    link: result.linkvip,
                    name: result.filename
                })
                console.log(body);
            });
        });
    }

    accountInfo(): DAccount {
        return this._account;
    }

    private preLogin(): Promise<{ cookie: string }> {
        return new Promise((resolve, reject) => {
            request(this._HOMEPAPGE, (err, res, body) => {
                const cookie = res.headers['set-cookie'];
                this._preCookie = cookie.join('; ');
                resolve({
                    cookie: cookie.join('; ')
                })
            });
        });
    }
}