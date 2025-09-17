import api from '@/api.js'

let user = null;

export const auth = () => {
    return api.cached(api.urls.idp + 'me').then(u => {
        user = u;

        return user;
    });
};

export const can = (permission) => {
    if (!user) {
        return false;
    }

    return user.permissions.includes(permission);
};

export const mainUrl = () => {
    return api.urls.idp.substring(0, api.urls.idp.length -4);
};