import { NextResponse } from "next/server";
import { create, claim, deploy, withdraw } from "./lib";

export async function POST(req) {
    const {fname, data} = await req.json();
    let result = null;
    
    if (fname === "create") {
        result = await create(data)
    }
    if (fname === "claim") {
        result = await claim(data)
    }
    if (fname === "deploy") {
        result = await deploy(data)
    }
    if (fname === "withdraw") {
        result = await withdraw(data)
    }

    return NextResponse.json(result)
}