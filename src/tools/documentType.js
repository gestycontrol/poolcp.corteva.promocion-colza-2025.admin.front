const countryCodes = ['ES'];

export const validateDniOrNie = (document) => {
    let document_letter,
        documentRegex = /^[XYZ]?\d{5,8}[A-Z]$/;

    document = document.toUpperCase();

    if (document &&
        documentRegex.test(document) === true) {
        document_letter = document.substr(document.length - 1, 1);

        return getDniOrNieLetter(document) == document_letter;
    } else {
        return false;
    }
};

export const getDniOrNieLetter = (document) => {
    document = document.toUpperCase().trim();
    document = document.padStart(8, '0').substring(0, 8);
    document = document.replace('X', 0);
    document = document.replace('Y', 1);
    document = document.replace('Z', 2);
    document = document.replace(/\D/g, '');

    let control = (document * 1) % 23;

    return 'TRWAGMYFPDXBNJZSQVHLCKET'.substring(control, control + 1);
};

export const validateDni = (document) => {
    return validateDniOrNie(document) &&
        String(parseInt(document.substring(0, 1))) === document.substring(0, 1);
};

export const validateNie = (document) => {
    return validateDniOrNie(document) &&
        String(parseInt(document.substring(0, 1))) !== document.substring(0, 1);
};

const isLetter = (letter) => {
    return /^[A-Z]$/.test(letter);
};

const calculateCifSum = (digits) => {
    let sum = 0;

    for (let i = 0; i < digits.length; ++i) {
        let digit = parseInt(digits[i]);

        if (isNaN(digit)) {
            return NaN;
        }

        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) {
                digit = parseInt(digit / 10) + (digit % 10);
            }
        }

        sum += digit;
    }

    return sum;
};

const isCifValidControlDigit = (letter, control, digit, letters) => {
    if (/[ABEH]/.test(letter)) {
        return String(digit) === control;
    }

    if (/[NPQRSW]/.test(letter)) {
        return letters[digit] === control;
    }

    return String(digit) === control || letters[digit] === control;
};

export const validateCif = (document) => {
    if (!document || document.length !== 9) {
        return false;
    }

    document = document.toUpperCase();

    const letters = ['J', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    const letter = document[0];
    const digits = document.slice(1, -1);
    const control = document.slice(-1);

    if (!isLetter(letter)) {
        return false;
    }

    const sum = calculateCifSum(digits);
    if (isNaN(sum)) {
        return false;
    }

    const digit = (sum % 10 === 0) ? 0 : 10 - (sum % 10);

    return isCifValidControlDigit(letter, control, digit, letters);
};

export const sanitizeDocument = (document) => {
    if (!document) return document;

    document = document.toString().trim().toUpperCase();
    document = document.split('/').join('');
    document = document.split('-').join('');
    document = document.split(' ').join('');
    document = document.split('.').join('');
    document = document.split('\\').join('');

    return document;
};

export const validateDocumentIfPossible = (country_code, document, document_type_code) => {
    if (!country_code || !document_type_code || !document) return true;
    if (!countryCodes.includes(country_code.toUpperCase())) return true;
    return validateDocument(document, document_type_code);
}

export const validateDocument = (document, document_type_code) => {
    if (!document) return false;
    if (!document_type_code) return true;

    document = sanitizeDocument(document);
    document_type_code = document_type_code.toLowerCase();

    if (document_type_code == 'nif') return validateDni(document) || validateCif(document);
    if (document_type_code == 'dni') return validateDni(document);
    if (document_type_code == 'nie') return validateNie(document);
    if (document_type_code == 'cif') return validateCif(document);
    if (document_type_code == 'id-es') return validateDni(document);
    if (document_type_code == 'vat-es') return validateCif(document);
    if (document_type_code == 'idx-es') return validateNie(document);

    return true;
}