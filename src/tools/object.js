export const isObject = (obj) => typeof obj === 'object' && obj !== null;
export const isNonArrayObject = (obj) => isObject(obj) && !Array.isArray(obj);
export const isNonEmptyObject = (obj) => isNonArrayObject(obj) && Object.keys(obj).length > 0;
export const isArray = Array.isArray;
export const isNonEmptyArray = (obj) => isArray(obj) && obj.length > 0;
export const isArrayOrObject = (obj) => isNonArrayObject(obj) || isArray(obj);

export const getAttr = (obj, attr) => {
    let result = null;

    if (!attr) {
        result = obj;
    } else if (isObject(obj)) {
        result = attr.split('.').reduce((acc, key) => acc?.[key], obj);
    }

    return result === undefined ? null : result;
};

export const duplicate = (obj) => (obj === null || obj === undefined) ? obj : JSON.parse(JSON.stringify(obj));

export const patchObject = (target, source) => {
    Object.keys(source).forEach(key => {
        if (isArray(source[key]) || !isObject(source[key])) {
            target[key] = duplicate(source[key]);
        } else {
            target[key] = target[key] || {};
            patchObject(target[key], source[key]);
        }
    });
};

export const initialize = (target, source) => {
    if (!source) {
        return;
    }

    Object.keys(source).sort((a, b) => a.localeCompare(b)).forEach(key => {
        if (source[key] == null) {
            return;
        }

        if (target[key] === undefined || !isObject(source[key]) || isArray(source[key]) !== isArray(target[key])) {
            target[key] = duplicate(source[key]);
        } else {
            initialize(target[key], source[key]);
        }
    });
};

export const extractKeys = (obj, prefix = '') => {
    if (!obj || !isObject(obj)) {
        return [];
    }

    return Object.keys(obj).reduce((keys, key) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const subKeys = isObject(obj[key]) ? extractKeys(obj[key], fullKey) : [];

        return [...keys, fullKey, ...subKeys];
    }, []);
};

export const hexToObject = (hex) => {
    try {
        const json = hex.match(/.{1,2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');

        if (json) {
            return JSON.parse(json);
        }
    } catch (error) {
    }

    return null;
};

export const objectToHex = (obj) => {
    try {
        return JSON.stringify(obj)
            .split('')
            .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase();
    } catch (error) {
        return null;
    }
};

export const flattenUrlObject = (obj) => {
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        obj[key] = value;

        if (value != null && value !== '') {
            if (isArray(value)) {
                obj[key] = value.map(v => extractKeyFromObject(v)).filter(Boolean).join(',');
            } else if (isObject(value)) {
                obj[key] = extractKeyFromObject(value);
            } else if (typeof value === 'boolean') {
                obj[key] = value ? 1 : 0;
            }
        }

        if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
            delete obj[key];
        }
    });
};

export const extractKeyFromObject = (obj) => obj?.id || obj?.code || obj?.value || extractUniqueKeyOrNullFromObject(obj);

export const extractUniqueKeyOrNullFromObject = (obj) => {
    if (!obj || !isObject(obj)) {
        return null;
    }

    const keys = Object.keys(obj);

    if (keys.length === 1
        && obj[keys[0]] !== null
        && obj[keys[0]] !== undefined
    ) {
        return obj[keys[0]];
    }

    return null;
}

export const extractLabelFromObject = (obj) => obj?.name || obj?.label || `${obj?.first_name || ''} ${obj?.last_name || ''}`.trim() || extractKeyFromObject(obj);
