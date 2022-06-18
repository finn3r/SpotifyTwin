import {atom} from "recoil";

export const playerAtom = atom({
    key: "playerAtom",
    default: <Spotify.Player><unknown>null
})