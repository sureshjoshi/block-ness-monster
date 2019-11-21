export class BlockedSite {
    public readonly url: string;
    constructor(public readonly hostname: string) {
        this.url = `*://*.${hostname}/*`;
    }

    public static key = "blockedSite";
}
