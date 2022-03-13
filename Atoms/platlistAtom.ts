import {atom} from "recoil";
import SinglePlaylistResponse = SpotifyApi.SinglePlaylistResponse;

export const playlistState = atom({
    key: "playlistState",
    default: <SinglePlaylistResponse><unknown>null
})

export const playlistIdState = atom({
    key: "playlistIdState",
    default: '37i9dQZF1DZ06evO1BPfyL'
})