import { OAuth2Client } from "google-auth-library";
const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
const client = new OAuth2Client(googleClientId);
export const verifyGoogleToken = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: googleClientId,
    });
    const payload = ticket.getPayload();
    if (!payload) {
        throw new Error("Invalid Google token");
    }
    return payload;
};
//# sourceMappingURL=google.js.map