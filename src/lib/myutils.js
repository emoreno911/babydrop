export const fallbackNoImage = "/noimage.svg";
export const cardThemeColors = "bg-white dark:bg-zinc-900";
export const bodyThemeColors =
    "bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-zinc-100";
export const formFieldStyle = 
    "w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline";

// gets an id string like the ones in Firebase
export const pseudoRandId = () => {
    const CHARS =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let autoId = "";

    for (let i = 0; i < 20; i++) {
        autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return autoId;
};

export const isNullAddress = (addr) => {
    return addr === "0x0000000000000000000000000000000000000000";
};

export const splitHexAddress = (addr) => {
    if (!addr) return "0x0";
    return `${addr.slice(0, 6)}...${addr.slice(addr.length - 4)}`;
}

export const toFixedIfNecessary = (value, dp) => {
    return +parseFloat(value).toFixed(dp);
}

export function sleep(ms) {
    return new Promise((val) => setTimeout(val, ms));
}