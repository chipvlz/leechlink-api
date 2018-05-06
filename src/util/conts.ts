export enum HostType {
    Fshare = 1
}

export function getOrigin(type: HostType) {
    switch (type) {
        case HostType.Fshare: return 'https://www.fshare.vn/file';
    }
}

export const defaulFsharetHeader = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Host': 'www.fshare.vn',
    'Origin': 'https://www.fshare.vn',
    'Referer': 'https://www.fshare.vn/',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8'
};

export const fshareLoginUrl = 'https://www.fshare.vn/login';
export const fshareSiteLoginUrl = 'https://www.fshare.vn/site/login';