import {atom} from "recoil";

export const currentTrackState = atom({
    key: "currentTrackState",
    default: <Spotify.Track><unknown>null
})

export const isPlayingState = atom({
    key: "isPlayingState",
    default: false
})