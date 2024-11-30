// custom hook which extends slightly on useState
// to make the data persist across browser refreshes
// based on design by logrocket

import {useState, useEffect } from "react";

function getStorageValue(key, defaultValue) {
    const saved = localStorage.getItem(key);
    const initial = JSON.parse(saved);
    return initial || defaultValue;
}

export const useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
        // override the defaulting behaviour to fetch local storage first 
        return getStorageValue(key, defaultValue);
    });
    useEffect(() => {
        // update storage on change
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value]);
    return [value, setValue];
}