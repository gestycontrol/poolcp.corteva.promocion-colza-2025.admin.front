const combinedEnv = import.meta.env || {};

const $env = (key, defaultValue) => {
    if (!key) return combinedEnv;

    let value = combinedEnv[key];

    if (value === undefined) {
        return defaultValue;
    }

    return value;
};

$env.loadStandAloneEnv = (viteStandaloneEnv) => {
    if (viteStandaloneEnv === undefined) {
        viteStandaloneEnv = combinedEnv.VITE_STANDALONE_ENV || Object.keys(combinedEnv).filter(k => k.startsWith('VITE_')).length == 0;
    }

    if (!viteStandaloneEnv || viteStandaloneEnv === 'false') {
        viteStandaloneEnv = false;
    } else if (viteStandaloneEnv && (typeof (viteStandaloneEnv) !== 'string' || viteStandaloneEnv == 'true')) {
        viteStandaloneEnv = '/env.json';
    }

    if (!viteStandaloneEnv) {
        return;
    }

    try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', viteStandaloneEnv, false);
        xhr.send();

        if (xhr.status === 200) {
            const script = xhr.responseText;
            const env = JSON.parse(script);

            Object.assign(combinedEnv, env);
        }
    } catch (e) {
    }
};

$env.loadStandAloneEnv();

export default $env;