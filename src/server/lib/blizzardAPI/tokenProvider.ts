import simpleOauth2, {OAuthClient, Token} from "simple-oauth2";
import {Inject, Service} from "typedi";
import {Args} from "../args";
import {ClientCredentials} from "./clientCredentials";

@Service()
export class TokenProvider {
    private readonly clientCredentials?: ClientCredentials;
    constructor(
        @Inject("args") private args: Args,
    ) {
        if(args.apiKey && args.apiSecret) {
            this.clientCredentials = new ClientCredentials(args.apiKey, args.apiSecret)
        }
    }

    async getToken(): Promise<Token> {
        if(this.clientCredentials) return this.clientCredentials.getToken()

        return Promise.reject("No api credentials")
    }
}