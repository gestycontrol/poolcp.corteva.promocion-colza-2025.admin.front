export const spaceCase = (text) => {
    if (!text) {
        return '';
    }

    text = text.replace('_', ' ');

    const result = text.replace(/([A-Z])/g, " $1");

    return result.charAt(0).toUpperCase() + result.slice(1);
};

export const titleCase = (text) => {
    if (!text) {
        return '';
    }


    return text.replace(/(^|\s)\S/g, function (t) { return t.toUpperCase() });
};

export const slugify = (text, separator = '-', dictionary = { '@': 'at' }) => {
    if (!text) {
        return '';
    }

    if (typeof text !== 'string') {
        text = text.toString();
    }

    text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const flip = separator === '-' ? '_' : '-';
    text = text.replace(new RegExp(`[${flip}]+`, 'g'), separator);

    for (const [key, value] of Object.entries(dictionary)) {
        text = text.replace(new RegExp(key, 'g'), separator + value + separator);
    }

    text = text.replace('.', separator);
    text = text.toLowerCase().replace(new RegExp(`[^${separator}\\p{L}\\p{N}\\s]+`, 'gu'), '');
    text = text.replace(new RegExp(`[${separator}\\s]+`, 'g'), separator);
    text = text.replace(new RegExp(`(^${separator}|${separator}$)`, 'g'), '');
    text = text.replace(new RegExp(`(${separator}){2,}`, 'g'), separator);

    return text;
};

export const removeAccents = (text) => {
    if (!text) {
        return '';
    }

    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};