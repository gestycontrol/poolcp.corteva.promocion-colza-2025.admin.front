export const setCookie = function (cookie_name, cookie_value, expiration_days) {
    const d = new Date();
    d.setTime(d.getTime() + (expiration_days * 24 * 60 * 60 * 1000));
    let expires = 'expires=' + d.toUTCString();
    document.cookie = `${cookie_name}=${cookie_value};${expires};path=/;SameSite=Lax`;
};

export const getCookie = function (cookie_name) {
    let name = cookie_name + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');

    for (const element of ca) {
        let c = element.trim();

        if (c.startsWith(name)) {
            return c.substring(name.length, c.length);
        }
    }

    return null;
};
