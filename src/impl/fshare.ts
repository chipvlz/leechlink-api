import { IGet } from "../interfaces/iget.interface";
import { FileInfo } from "../models/fileinfo";
import { codeToUrl } from "../util/util";
import { HostType, defaulFsharetHeader } from "../util/conts";
import * as request from 'request';
import * as cheerio from 'cheerio';
import { Dlink } from "../models/dlink";

export class Fshare implements IGet {
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
    login(account: Account): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    dlink(code: string): Promise<Dlink> {
        throw new Error("Method not implemented.");
    }
}