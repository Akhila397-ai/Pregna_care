import { OAuth2Client,TokenPayload } from "google-auth-library";

export class GoogleAuth {

    private static client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    static async verifyToken(token: string): Promise<TokenPayload> {
        const ticket = await this.client.verifyIdToken({
            idToken:token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if(!payload){
            throw new Error("Invalid Google token");
        }
        return payload;
    }
}