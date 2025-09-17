export const formatNumberESWithSignificantScale = function (number, min_scale = null, significant_digits = 3) {
    const scales = {
        'T': 18,
        'B': 12,
        'MM': 9,
        'M': 6,
        'K': 3,
    };

    if (number === null || number === false) return '';

    number = parseFloat(number);
    let is_negative = number < 0;
    if (is_negative) number = -number;
    let current_scale = null;

    for (const [temp_scale, scale_value] of Object.entries(scales)) {
        if (current_scale && current_scale > scale_value) continue;
        if (min_scale && min_scale > scale_value) continue;

        if (number >= Math.pow(10, scale_value)) {
            number = number / Math.pow(10, scale_value);
            current_scale = temp_scale;
        }
    }

    const digits = Math.floor(number).toString().length;
    const decimals = significant_digits - digits;

    const formatted = formatNumberES(number * (is_negative ? -1 : 1), decimals, true);

    if (current_scale) {
        return formatted + current_scale;
    }

    return formatted;
}

export const formatNumberES = (number, decimals, optional_decimals) => {
    if (number === null || number === undefined) return '';
    if (decimals === undefined) decimals = 0;
    if (optional_decimals === undefined) optional_decimals = false;

    number = number * 1;
    let intPart;

    if (number > 1) {
        intPart = Math.floor(number);
    } else {
        intPart = Math.ceil(number);
    }

    let decimalPart = number - intPart;
    decimalPart = Math.round(decimalPart * Math.pow(10, decimals));

    if (decimalPart == 0 && optional_decimals) {
        decimals = 0;
    }

    if (Math.abs(decimalPart) === 0
        && Math.abs(intPart) === 0
    ) {
        number = 0;
    }

    let formatted = (number * 1).toLocaleString('de-DE', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });

    return formatted;
};

export const formatNumberESIntPart = (number) => {
    if (number === null || number === undefined) return '';

    number = number * 1;
    let intPart;

    if (number > 1) {
        intPart = Math.floor(number);
    } else {
        intPart = Math.ceil(number);
    }

    return formatNumberES(intPart);
};

export const formatNumberESDecimalPart = (number, decimals, optional_decimals) => {
    if (number === null || number === undefined) return '';

    number = Math.abs(number);

    if (decimals === undefined) {
        decimals = 0;
    }

    if (optional_decimals === undefined) {
        optional_decimals = false;
    }

    number = number * 1;
    let intPart = Math.floor(number);

    let decimalPart = number - intPart;
    decimalPart = Math.round(decimalPart * Math.pow(10, decimals));

    if ((decimalPart == 0 || decimalPart == -0) && optional_decimals) {
        return '';
    }

    decimalPart = decimalPart.toString().padStart(decimals, '0');

    return ',' + decimalPart;
};