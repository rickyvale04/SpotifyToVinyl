import { atom } from "recoil"

// Define atom for playlist state
const playlistState = atom({
    key: "playlistState",
    default: []
})

export { playlistState }
