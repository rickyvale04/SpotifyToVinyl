import { atom } from "recoil"

// Define atom for playlist state
const playlistState = atom({
    key: "playlistState",
    default: []
})

// Define atom for user state
const userState = atom({
    key: "userState",
    default: []
})

export { playlistState, userState }
