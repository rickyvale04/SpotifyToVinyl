import { atom } from "recoil"

// Define atom for user state
const userState = atom({
    key: "userState",
    default: []
})

export { userState }