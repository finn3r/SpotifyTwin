import SpotifyWebApi from "spotify-web-api-node";

const scopes: string = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-library-read",
    // "user-library-modify"
    "user-top-read",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-follow-read"
].join(',');

const params = {
    scope: scopes,
};

const queryParamString: string = new URLSearchParams(params).toString();

const LOGIN_URL: string = `https://accounts.spotify.com/authorize?${queryParamString}`;

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!
});

export default spotifyApi;
export { LOGIN_URL };
