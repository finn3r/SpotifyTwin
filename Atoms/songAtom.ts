import {atom} from "recoil";

export const currentTrackIdState = atom({
    key: "currentTrackIdState",
    default: <string><unknown>null
})

export const isPlayingState = atom({
    key: "isPlayingState",
    default: false
})