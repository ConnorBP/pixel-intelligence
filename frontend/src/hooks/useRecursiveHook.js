// https://www.aaron-powell.com/posts/2019-09-23-recursive-settimeout-with-react-hooks/

import React, { useEffect, useRef } from "react";
import PropTypes from 'prop-types';

// variation of the useRecursiveTimeout hook that allows
// for a callback to end the chain by returning true
function useRecursiveTimeout(
    callback, // async callback
    delay,   // delay in ms
    additionalDependencies = [] // additional dependencies to watch for
) {
    const savedCallback = useRef(callback);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback, ...additionalDependencies]);


    // Set up the timeout loop.
    useEffect(() => {
        let id;
        function tick() {
            // call the current callback and save the result
            const ret = savedCallback.current();
            // check if result as async or sync
            if (ret instanceof Promise) {
                ret.then((res) => {
                    // call next tick only if the promise resolves didn't return true
                    if (res !== true && delay !== null) {
                        id = setTimeout(tick, delay);
                    }
                });
            } else {
                // call the next tick only if the callback didn't return true
                if (ret !== true && delay !== null) {
                    id = setTimeout(tick, delay);
                }
            }
        }
        
        if (delay !== null) {
            id = setTimeout(tick, delay);
            return () => id && clearTimeout(id);
        }

    }, [delay, ...additionalDependencies]);

    return savedCallback;
}

useRecursiveTimeout.propTypes = {
    callback: PropTypes.func.isRequired,
    delay: PropTypes.number.isRequired
};

export default useRecursiveTimeout;
