const config = {
    backend: {
        featuresResources: {},
        api_url: null,
    },
    idp: {},
    urls: {},
    exportUrls: {},
};

import $env from '@/tools/environment.js';

const env = $env();

for (let envVariable in env) {
    if (envVariable.startsWith('VITE_') &&
        envVariable.endsWith('_URL')) {
        let microservice = envVariable.split('_')[1].toLowerCase();

        config.urls[microservice] = env[envVariable];
        config.exportUrls[microservice] = env[envVariable];

        if (!config.exportUrls[microservice].includes('/api/')) {
            config.exportUrls[microservice] += '/api';
        }

        if (!config.exportUrls[microservice].endsWith('/')) {
            config.exportUrls[microservice] += '/';
        }

        if (microservice === 'backend') {
            config.backend.api_url = config.exportUrls[microservice];
        }
    }
}

delete config.urls.backend_api;
delete config.exportUrls.backend_api;

config.idp.url = config.urls.idp || '';
config.idp.client_id = $env('VITE_IDP_CLIENT_ID');
config.idp.user_origin = $env('VITE_IDP_USER_ORIGIN');
config.idp.allow_password = $env('VITE_IDP_ALLOW_USERNAME_AND_PASSWORD') == 'true';
config.idp.allow_otp_login = $env('VITE_IDP_ALLOW_OTP_LOGIN') == 'true';

config.urls.backend = config.urls.backend || '';
config.backend.url = config.urls.backend;
config.backend.api_url = ($env('VITE_BACKEND_API_URL') || config.backend.api_url);
config.backend.api_trailing_slash = ($env('VITE_BACKEND_API_TRAILING_SLASH') || false);
config.backend.api_authorization_header = ($env('VITE_BACKEND_API_AUTHORIZATION_HEADER') || 'Authorization: Bearer ');
config.backend.nonAuthUrls = ($env('VITE_BACKEND_NON_AUTH_URL_PREFIXES') || 'tokens/').split(',').filter(Boolean);
config.backend.acceptUnauthorizedUrls = ($env('VITE_BACKEND_ACCEPT_UNAUTHORIZED_URL_PREFIXES') || '').split(',').filter(Boolean);
config.backend.featuresResources.private = ($env('VITE_BACKEND_FEATURE_PRIVATE_RESOURCE') || null);
config.backend.featuresResources.public = ($env('VITE_BACKEND_FEATURE_PUBLIC_RESOURCE') || null);
config.backend.is_ipd = $env('VITE_IPD_IS_SELF');
config.backend.devEnvironmentName = $env('VITE_DEV_ENVIRONMENT_NAME', null);
config.backend.includeCredentials = $env('VITE_BACKEND_INCLUDE_CREDENTIALS', 'false') == 'true';
config.registerRevokedTokens = $env('VITE_REGISTER_REVOKED_TOKENS', 'false') == 'true';

if (config.urls.backend.includes('pre.')) {
    config.backend.devEnvironmentName = 'PRE';
} else if (config.urls.backend.includes('des.')) {
    config.backend.devEnvironmentName = 'DES';
} else if (config.urls.backend.includes('int.')) {
    config.backend.devEnvironmentName = 'INT';
} else if (config.urls.backend.includes('localhost') ||
    config.urls.backend.includes('127.0.0.1')) {
    config.backend.devEnvironmentName = 'LOCAL';
} else if (window.location.host.includes('localhost') ||
    window.location.host.includes('127.0.0.1')) {
    document.getElementById('app').setAttribute('data-local-backend-url', config.urls.backend);
}

config.idp.login_page_url = config.idp.url + '/requestLogin/application/' + config.idp.client_id + '/' + (config.idp.user_origin || 'default');
config.idp.logout_page_url = config.idp.url + '/logout';
config.exportUrls.idp_login_page = config.idp.login_page_url;

const auth = {
    token: null,
    user: {
        loggedIn: false,
    },
    loggingIn: false,
    redirected: false,
};

try {
    auth.token = localStorage.auth_token;
} catch (e) {
    console.error(e);
}

let unresolvablePromise = new Promise(() => { });
let pending_requests_count = 0;

import { downloadFile, } from '@/tools/file.js';
import {
    duplicate,
    hexToObject,
    objectToHex,
} from '@/tools/object.js';

const fakeUserAuthJSON = $env('VITE_FAKE_USER');

if (fakeUserAuthJSON) {
    let fakeUserAuth = JSON.parse(fakeUserAuthJSON);

    if (fakeUserAuth) {
        for (let k in fakeUserAuth.user) {
            auth.user[k] = fakeUserAuth.user[k];
        }

        auth.token = fakeUserAuth.token;
        auth.user.permissions = fakeUserAuth.permissions;
        auth.user.loggedIn = !!auth.user.id;
        auth.loggingIn = false;
    }
}

const defaultHeaders = {};
const defaultQueryParams = {};

export default {
    urls: config.exportUrls,
    devEnvironmentName() {
        return config.backend.devEnvironmentName;
    },
    modifiedRecords: {},
    setDefaultHeader(name, value) {
        if (value === undefined) {
            delete defaultHeaders[name];
        } else {
            defaultHeaders[name] = value;
        }
    },
    setDefaultQueryParam(name, value) {
        if (value === undefined) {
            delete defaultQueryParams[name];
        } else {
            defaultQueryParams[name] = value;
        }
    },
    isIdle() {
        return pending_requests_count == 0;
    },
    waitForIdle(delay, confirm) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.isIdle()) {
                    if (!confirm) {
                        this.waitForIdle(delay, true).then(resolve);
                    } else {
                        resolve();
                    }
                } else {
                    this.waitForIdle(delay).then(resolve);
                }
            }, delay);
        });
    },
    request: function (method, resource, queryParams, postData, parseFunction, accept, options) {
        if (auth.redirected) {
            return unresolvablePromise;
        }

        let promise;
        pending_requests_count++;

        let { url, isExternalAppUrl } = this.buildUrl(resource);

        if (!url) {
            pending_requests_count--;
            promise = Promise.reject(new Error('Invalid URL'));
        } else {
            const { body, headers, ignoreRequest } = this.prepareHeadersAndBody(url, resource, queryParams, postData, accept);

            if (ignoreRequest) {
                pending_requests_count--;
                promise = unresolvablePromise;
            } else {
                promise = this.performFetch(url, method, body, headers, parseFunction, isExternalAppUrl, resource, options);
            }
        }

        return promise;
    },
    buildUrl: function (resource) {
        let url = null;
        let isExternalAppUrl = false;

        if (this.isExternalUrl(resource)) {
            url = new URL(resource);
            isExternalAppUrl = true;
        } else {
            resource = this.addTrailingSlash(resource);
            url = new URL(config.backend.api_url + resource);
        }

        return { url, isExternalAppUrl };
    },
    isExternalUrl: function (resource) {
        return resource && (resource.toLowerCase().startsWith('http://') || resource.toLowerCase().startsWith('https://'));
    },
    addTrailingSlash: function (resource) {
        if (config.backend.api_trailing_slash && !resource.split('?')[0].endsWith('/')) {
            let resourceParts = resource.split('?');
            resourceParts[0] += '/';

            return resourceParts.join('?');
        }

        return resource;
    },
    prepareHeadersAndBody: function (url, resource, queryParams, postData, accept) {
        let headers = {};
        let body = null;

        if (!queryParams) {
            queryParams = {};
        }

        this.addDefaultQueryParams(queryParams);

        if (queryParams) {
            Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
        }

        if (this.isAuthRequired(resource)
            && !this.addAuthorizationHeader(headers)) {
            return { body, headers, ignoreRequest: true, };
        }

        this.addDefaultHeaders(headers, accept);

        if (postData) {
            if (!(postData instanceof FormData)) {
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify(postData);
            } else {
                body = postData;
            }
        }

        return { body, headers, ignoreRequest: false };
    },
    isAuthRequired: function (resource) {
        return resource !== 'tokens' && !config.backend.nonAuthUrls.some(prefix => resource.startsWith(prefix)
            || resource.startsWith(config.backend.api_url + prefix));
    },
    addAuthorizationHeader: function (headers) {
        if (auth.token) {
            const authHeader = config.backend.api_authorization_header.split(':');
            headers[authHeader[0].trim()] = ((authHeader[1] || '') + auth.token).trim();

            return true;
        } else {
            return false;
        }
    },
    addDefaultQueryParams: function (queryParams) {
        if (!queryParams) {
            queryParams = {};
        }

        for (let k in defaultQueryParams) {
            if (queryParams[k] === undefined) {
                queryParams[k] = defaultQueryParams[k];
            }
        }
    },
    addDefaultHeaders: function (headers, accept) {
        for (let k in defaultHeaders) {
            headers[k] = defaultHeaders[k];
        }

        headers['Accept'] = accept || 'application/json';
    },
    performFetch: function (url, method, body, headers, parseFunction, isExternalAppUrl, resource) {
        const options = arguments[7] || {};

        return new Promise((resolve, reject) => {
            const fetchOptions = {
                method,
                body,
                headers,
            };

            if (config.backend.includeCredentials) {
                fetchOptions.credentials = 'include';
            }

            fetch(url, fetchOptions).then(response => {
                pending_requests_count--;

                if (!response.ok && options.resolveEmptyOnFailure) {
                    resolve({ data: null, headers: response.headers });
                    return;
                }

                if (!this.handleUnauthorizedResponse(response, isExternalAppUrl, resource, reject)
                    || !this.handleErrorResponse(response, reject)) {
                    return;
                }

                if (response.status === 204) {
                    resolve({ data: null, headers: response.headers });
                    return;
                }

                this.parseResponse(response, parseFunction)
                    .then(parsedData => {
                        if (response.ok) {
                            resolve({ data: parsedData, headers: response.headers });
                        } else {
                            const err = new Error(parsedData);
                            err.response = parsedData;
                            reject(err);
                        }
                    })
                    .catch(reject);
            }).catch(reject);
        });
    },
    handleUnauthorizedResponse: function (response, isExternalAppUrl, resource, reject) {
        if (!response.ok && (response.status === 401 || response.status === 403)) {
            if (!isExternalAppUrl && !config.backend.acceptUnauthorizedUrls.some(prefix => resource.startsWith(prefix))) {
                if (response.status === 401 && auth.token) {
                    this.setToken(null);
                    location.reload();
                } else {
                    this.setToken(null);
                }
            } else {
                reject(response.statusText);
            }

            return false;
        }

        return true;
    },
    handleErrorResponse: function (response, reject) {
        if (!response.ok && response.status !== 422) {
            reject(response.statusText);

            return false;
        }

        return true;
    },
    parseResponse: function (response, parseFunction) {
        if (!parseFunction) {
            parseFunction = (response) => response.json();
        }

        return parseFunction(response);
    },
    requestFile: function (method, resource, queryParams, data, basename) {
        return this.request(method, resource, queryParams, data, (result) => downloadFile(result, basename), '*/*');
    },
    clearCache() {
        this.cachedGetRequests = {};
    },
    cachedGetRequests: {},
    cached: function (resource, queryParams) {
        let key = JSON.stringify([resource, queryParams]);

        if (!this.cachedGetRequests[key]) {
            this.cachedGetRequests[key] = 'pending';
            return new Promise((resolve, reject) => {
                this.get(resource, queryParams).then(result => {
                    this.cachedGetRequests[key] = result;
                    resolve(duplicate(result));
                }).catch(reject);
            });
        } else if (this.cachedGetRequests[key] === 'pending') {
            return new Promise(resolve => {
                setTimeout(() => {
                    this.cached(resource, queryParams).then(resolve);
                }, 100);
            });
        } else {
            return Promise.resolve(duplicate(this.cachedGetRequests[key]));
        }
    },
    getFile: function (resource, queryParams, basename) {
        return this.requestFile('GET', resource, queryParams, null, basename);
    },
    getWithHeaders: function (resource, queryParams) {
        return this.request('GET', resource, queryParams, null);
    },
    get: function (resource, queryParams) {
        return this.request('GET', resource, queryParams, null).then(result => result?.data);
    },
    post: function (resource, data) {
        return this.request('POST', resource, {}, data).then(result => result?.data);
    },
    postFormData: function (resource, formData, queryParams) {
        return this.request('POST', resource, queryParams, formData).then(result => result?.data);
    },
    patch: function (resource, data, queryParams) {
        return this.request('PATCH', resource, queryParams, data).then(result => result?.data);
    },
    put: function (resource, data, queryParams) {
        return this.request('PUT', resource, queryParams, data).then(result => result?.data);
    },
    delete: function (resource, queryParams) {
        return this.request('DELETE', resource, queryParams).then(result => result?.data);
    },
    hasAuthToken() {
        return !!auth.token;
    },
    getAuthtoken() {
        return auth.token;
    },
    setToken(token, do_not_update_user) {
        this.clearCache();

        try {
            localStorage.auth_token = token || '';
        } catch (e) {
            console.error(e);
        }

        auth.token = token;
        auth.user.loggedIn = false;

        if (!token) {
            auth.loggingIn = false;
        }

        if (!do_not_update_user) {
            return this.updateUserData();
        }
    },
    updateUserData() {
        if (!auth.token) {
            return Promise.resolve(auth.user);
        }

        return new Promise((resolve) => {
            this.get('me').then((result) => {
                let user = result.user;

                for (let k in user) {
                    auth.user[k] = user[k];
                }

                auth.user.collaborator = result.collaborator;
                auth.user.permissions = result.permissions;
                auth.user.loggedIn = !!auth.user.id;
                auth.loggingIn = false;

                if (!auth.user.loggedIn) {
                    this.setToken(null).then(() => {
                        resolve(auth.user);
                    });
                } else {
                    resolve(auth.user);
                }
            }).catch(() => {
                auth.user.loggedIn = false;
                this.setToken(null).then(() => {
                    resolve(auth.user);
                });
            });
        });
    },
    updateUserLanguage(lang) {
        return this.request('PUT', 'me/language', undefined, { language: { code: lang } }, undefined, undefined, {
            resolveEmptyOnFailure: true,
        });
    },
    logout() {
        return new Promise((resolve, reject) => {
            if (config.registerRevokedTokens) {
                if (localStorage.ad_cookie) {
                    this.post('logout/ad', {
                        tokens: [
                            localStorage.ad_cookie,
                        ]
                    }).then(() => {
                        this.setLogout();
                        resolve();
                    }).catch(reject);
                } else if (localStorage.auth_token) {
                    this.post('logout', {
                        tokens: [
                            localStorage.auth_token,
                        ]
                    }).then(() => {
                        this.setLogout();
                        resolve();
                    }).catch(reject);
                }
            } else {
                this.setLogout();
                resolve();
            }
        });
    },
    setLogout() {
        try {
            localStorage.clear();
        } catch (e) {
            console.error(e);
        }

        auth.token = null;
        auth.user = {
            loggedIn: false
        };
    },
    login(params, state) {
        if (auth.redirected) return unresolvablePromise;

        if (params?.error) {
            return Promise.resolve({
                name: 'LoginError'
            });
        }

        if (config.backend.is_ipd &&
            location.pathname == '/login') {
            window.location.href = config.idp.url + '/requestLogin/' + config.idp.user_origin + '/code' + location.search;

            return unresolvablePromise;
        } else if (location.pathname == '/fromlogin') {
            return new Promise((resolve) => {
                this.auth(params.code).then(user => {
                    if (user.id) {
                        let state = hexToObject(params.state) || { name: 'Index' };

                        resolve(state);
                    } else {
                        resolve({
                            name: 'LoginError'
                        });
                    }
                });
            });
        }

        let redirect_uri = window.location.protocol + '//' + window.location.host + '/fromlogin';
        let login_page = config.idp.login_page_url;

        if (config.idp.allow_otp_login) {
            return Promise.resolve({
                name: 'LoginWithOtp',
                query: {
                    redirect_uri: redirect_uri,
                    state: objectToHex(state),
                }
            });
        } else if (config.idp.allow_password) {
            return Promise.resolve({
                name: 'LoginWithPassword',
                query: {
                    redirect_uri: redirect_uri,
                    state: objectToHex(state),
                }
            });
        } else {
            auth.redirected = true;
            window.location.href = login_page + '?redirect_uri=' + encodeURIComponent(redirect_uri) + '&state=' + encodeURIComponent(objectToHex(state));
        }

        return unresolvablePromise;
    },
    auth(code) {
        if (auth.redirected) return unresolvablePromise;

        if (!auth.user.loggedIn &&
            auth.loggingIn &&
            !code) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.auth().then(resolve).catch(reject);
                }, 100);
            });
        }

        if (auth.token &&
            !auth.user.loggedIn) {
            this.loggingIn = true;
            return this.updateUserData();
        }

        if (!auth.token &&
            code) {
            this.loggingIn = true;
            return new Promise((resolve) => {
                this.post('tokens' + (config.backend.is_ipd ? '/idp' : ''), {
                    code,
                }).then((result) => {
                    if (!result.token) {
                        auth.user.loggedIn = false;
                        this.setToken(null).then(() => {
                            resolve(auth.user);
                        });
                    } else {
                        this.setToken(result.token).then(() => {
                            resolve(auth.user);
                        });
                    }
                }).catch(() => {
                    auth.user.loggedIn = false;
                    this.setToken(null).then(() => {
                        resolve(auth.user);
                    });
                });
            });
        }

        return Promise.resolve(auth.user);
    },
    can(permission_name) {
        return auth.user.permissions &&
            auth.user.permissions.indexOf(permission_name) != -1;
    },
    getFeatures(public_only) {
        let resource = config.backend?.featuresResources?.public;

        if (this.hasAuthToken()
            && !public_only) {
            resource = config.backend?.featuresResources?.private;
        }

        if (!resource) {
            return Promise.resolve({});
        }

        return this.cached(resource);
    },
    logoutUrl() {
        return config.idp.logout_page_url;
    },
};