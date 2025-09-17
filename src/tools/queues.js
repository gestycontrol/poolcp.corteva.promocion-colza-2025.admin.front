export const delayedAction = (callback, minMilliseconds) => {
    let milliseconds = minMilliseconds || 1500,
        timeout,
        force = () => {
            clearTimeout(timeout);
            callback();
        },
        queue = () => {
            clearTimeout(timeout);
            timeout = setTimeout(force, milliseconds)
        };

    return {
        queue,
        force,
    }
};