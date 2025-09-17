export const saveLocal = (key, value) => {
    localStorage[key] = JSON.stringify(value);
};

export const getLocal = (key) => {
    try {
        return localStorage[key];
    } catch (e) { }

    return null;
};
