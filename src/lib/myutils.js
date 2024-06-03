import { bytesToHex } from "viem";

export const fallbackNoImage = "/noimage.svg";
export const cardThemeColors = "bg-white dark:bg-zinc-900";
export const bodyThemeColors =
    "bg-slate-800 text-gray-200 dark:bg-zinc-800 dark:text-zinc-100";
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

export const divideByDecimals = (num, decimals) => {
	const divider = parseInt(`1${Array(decimals).fill(0).join('')}`);
	return toFixedIfNecessary(num/divider, 8);
}

export const multiplyByDecimals = (num, decimals) => {
	const multiplier = parseInt(`1${Array(decimals).fill(0).join('')}`);
	return toFixedIfNecessary(num*multiplier, 8);
}

export function sleep(ms) {
    return new Promise((val) => setTimeout(val, ms));
}

export const makeHash = async (string) => {
	const utf8 = new TextEncoder().encode(string);
	const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = bytesToHex(new Uint32Array(hashArray));

	return hashHex; //hashArray;
}

export const storeLocalDeposit = (depositId, amount, token, txid, network) => {
	const storeName = "bbdDeposits";
	const obj = { depositId, amount, token, txid, network };
	
	let existing = localStorage.getItem(storeName);
	let arr = existing === null ? [] : JSON.parse(existing);
	arr.push(obj);
	localStorage.setItem(storeName, JSON.stringify(arr));
}

export const listDeposits = () => {
    if (typeof localStorage === "undefined") return [];
	const storeName = "bbdDeposits";
	let existing = localStorage.getItem(storeName);
    if (!existing) return [];
	let arr = JSON.parse(existing);
	let view = arr.map((o,i) => `${i+1}) ${o.amount} | ${o.token} | ${o.depositId}`)
	return view
}

export async function postJSON(url, data) {
    let result = null;
    try {
      const response = await fetch(url, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      result = await response.json();
      //console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }

    return result
}