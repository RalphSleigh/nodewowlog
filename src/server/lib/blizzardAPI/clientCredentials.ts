import simpleOauth2, {OAuthClient, Token} from "simple-oauth2";

export class ClientCredentials {
    private oauth2: OAuthClient;
    private tokenPromise?: Promise<Token>;

    constructor(apiKey: string, apiSecret: string) {
        this.oauth2 = simpleOauth2.create({
            client: {
                id: apiKey,
                secret: apiSecret
            },
            auth: {
                tokenHost: "https://eu.battle.net"
            }
        })

        // this.tokenPromise = this.fetchToken()
    }

    async fetchToken(): Promise<Token> {
        console.log('getting token')
        const result = await this.oauth2.clientCredentials.getToken({});
        return this.oauth2.accessToken.create(result);
    }

    async getToken(): Promise<Token> {
        let token = undefined
        if(this.tokenPromise) {
            token = await this.tokenPromise
        }
        if (!token || token.expired()) {
            this.tokenPromise = this.fetchToken()
            const token = await this.tokenPromise
            return token.token.access_token
        }
        return token.token.access_token
    }
}