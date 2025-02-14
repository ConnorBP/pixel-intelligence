// custom hook which extends slightly on useState
// to make the data persist across browser refreshes
// based on design by logrocket

import {useState, useEffect } from "react";

export function getStorageValue(key, defaultValue) {
    const saved = localStorage.getItem(key);
    let initial = null; 
    try{initial = JSON.parse(saved)} catch(e) {
        console.log('error parsing json for ', saved, e);
        initial = saved
    };
    return initial || defaultValue;
}

export const useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
        // override the defaulting behaviour to fetch local storage first 
        return getStorageValue(key, defaultValue);
    });
    useEffect(() => {
        // update storage on change
        const strout = JSON.stringify(value);
        // console.log(`setting ${key} to: ${strout}`);
        localStorage.setItem(key, strout);
    }, [key, value]);
    return [value, setValue];
}