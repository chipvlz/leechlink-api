import { HostType } from "../util/conts";

export interface DAccount {
    email: string;
    password: string;
    type: HostType
}