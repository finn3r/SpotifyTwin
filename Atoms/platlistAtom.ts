import {atom} from "recoil";

export const userPlaylistsState = atom({
    key: "userPlaylistsState",
    default: <SpotifyApi.PlaylistObjectSimplified[]>[]
})