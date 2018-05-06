import { IGet } from "../interfaces/iget.interface";
import { FileInfo } from "../models/fileinfo";
import { codeToUrl, mergeHeaders } from "../util/util";
import { HostType, defaulFsharetHeader, fshareLoginUrl, fshareSiteLoginUrl } from "../util/conts";
import * as request from 'request';
import * as cheerio from 'cheerio';
import { Dlink } from "../models/dlink";
import { DAccount } from "../models/account";

export class Fshare implements IGet {
    _account: DAccount;
    _loggedCookie: string;

    constructor(account: DAccount) {
        this._account = account;
    }

    getInfo(code: string): Promise<FileInfo> {
        const url = codeToUrl(code, HostType.Fshare);

        return new Promise((resolve, reject) => {

            request.get(url, {
                headers: defaulFsharetHeader
            }, (err, res, body) => {
                const $ = cheerio.load(body);
                $('.name').children().remove();
                $('.size').children().remove();
                resolve({
                    name: $('.name').text().trim(),
                    size: $('.size').text().trim()
                });
            });
        });
    }

    async login(): Promise<boolean> {
        const preData = await this.get_csrf();

        const formData = {
            '_csrf-app': preData.csrf,
            'LoginForm[email]': `${this._account.email}`,
            'LoginForm[password]': `${this._account.password}`,
            'LoginForm[rememberMe]': 0
        }

        const options = {
            headers: Object.assign({}, defaulFsharetHeader, { 'Cookie': preData.cookie }),
            formData: formData
        }

        return new Promise((resolve, reject) => {
            request.post(fshareSiteLoginUrl, options, (err, res, body) => {

                // Result data
                const result = {
                    headers: res.headers,
                    cookie: res.headers['set-cookie'][0]
                };

                // Store cookie
                this._loggedCookie = result.cookie;

                resolve(true);
            });
        }) as any;
    }

    dlink(code: string): Promise<Dlink> {
        return new Promise(resolve => {
            this.get_csrf_after_loggedIn(code, this._loggedCookie).then(d => {
                const formData = {
                    '_csrf-app': d.csrf,
                    'linkcode': code,
                    'withFcode5': '0',
                    'fcode5': ''
                }
                let options: any = {
                    headers: mergeHeaders({ 'Cookie': this._loggedCookie }, HostType.Fshare)
                }
                options.formData = formData;

                request.post('https://www.fshare.vn/download/get', options, (err, res, body) => {
                    const data = JSON.parse(body);
                    resolve({
                        link: data.url,
                        name: data.name
                    });
                });
            })
        });
    }

    accountInfo(): DAccount {
        return this._account;
    }

    // Private functions

    private get_csrf_after_loggedIn(code: string, loggedInCookie: string): Promise<{ csrf: string }> {
        const link = codeToUrl(code, HostType.Fshare);
        const options = {
            headers: mergeHeaders({ 'Cookie': loggedInCookie }, HostType.Fshare)
        }

        return new Promise((resolve, reject) => {
            request.get(link, options, (err, res, body) => {
                const $ = cheerio.load(body);
                const csrf = $('meta[name="csrf-token"]').attr('content');

                resolve({
                    csrf: csrf
                })
            });
        });
    }

    private get_csrf(): Promise<{ cookie: string, csrf: string }> {
        return new Promise((resolve, reject) => {
            request(fshareLoginUrl, (err, res, body) => {
                const $ = cheerio.load(body);
                const csrf = $('meta[name="csrf-token"]').attr('content');
                const cookie = res.headers['set-cookie'][0];

                resolve({
                    cookie: cookie,
                    csrf: csrf
                })
            });
        });
    }
}