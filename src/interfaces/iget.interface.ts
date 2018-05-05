import { FileInfo } from "../models/fileinfo";
import { Dlink } from "../models/dlink";

export interface IGet {
    getInfo(code: string): Promise<FileInfo>;
    login(account: Account): Promise<boolean>;
    dlink(code: string): Promise<Dlink>;
}