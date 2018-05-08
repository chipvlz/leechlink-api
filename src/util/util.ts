import { HostType, getOrigin, defaulFsharetHeader } from "./conts";

export function url2Code(url: string) {
    const arr = url.split('/');
    return arr[arr.length];
}

export function codeToUrl(code: string, type: HostType) {
    return `${getOrigin(type)}/${code}`;
}

export function cookieToObj(cookie: string): any {
    let arr = cookie.split('; ');
    let result = {};
    for (let i = 0; i < arr.length; i++) {
        let cur = arr[i].split('=');
        result[cur[0]] = cur[1];
    }
    return result;
}

export function mergeHeaders(newProp: Object, type: HostType) {
    let defaultHeader;

    switch (type) {
        case HostType.Fshare: defaultHeader = defaulFsharetHeader;
    }

    return Object.assign({}, defaultHeader, newProp);
}