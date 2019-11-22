export class BlockedSite {
    public readonly url: string;
    public readonly hostname: string;

    constructor(hostname: string) {
        this.hostname = hostname.startsWith("www.") ? hostname.substring(4) : hostname;
        this.url = `*://*.${this.hostname}/*`;
    }

    public static key = "blockedSite";
}
