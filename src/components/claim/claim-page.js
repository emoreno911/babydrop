"use client"

import { useEffect, useState } from "react";
import { validate as uuidValidate } from 'uuid';
import { useApp } from "@/src/context";
import RequestPassword from "./request-password";
import ShowItem from "./show-item";
import { usePathname } from "next/navigation";

const ClaimPage = ({ id }) => {
    const { 
        fn: { makeValidate } 
    } = useApp()

    const pathname = usePathname()

    const [errorMessage, setErrorMessage] = useState("");
    
    const [isValidated, setIsValidated] = useState(false);
    const [item, setItem] = useState(null);
    useEffect(() => {  
        setIsValidated(false)
    }, [pathname])

    const submitValidation = async (pwd) => { 
        setErrorMessage("");
        
        if (!uuidValidate(id)) {
            setErrorMessage("Invalid ID, please check your url");
            return;
        }

        let response = await makeValidate(id, pwd);

        if (response !== null) {
            let item = response
            setItem(item)
            setIsValidated(true)
        }
        else {
            setIsValidated(false);
            setErrorMessage("Password doesn't match");
        }
    }

    return !isValidated ?
        <RequestPassword
            errorMessage={errorMessage} 
            submitValidation={submitValidation} 
        /> : 
        <ShowItem item={item} />
}

export default ClaimPage