import { FileInfo } from "../models/fileinfo";
import { Dlink } from "../models/dlink";
import { DAccount } from "../models/account";

export interface IGet {
    getInfo(code: string): Promise<FileInfo>;
    login(): Promise<boolean>;
    dlink(code: string): Promise<Dlink>;

    accountInfo(): DAccount;
}