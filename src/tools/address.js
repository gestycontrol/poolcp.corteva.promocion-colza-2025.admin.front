const joinParts = (parts, separator = ' ') => parts.filter(Boolean).join(separator);

const formatStreetNumberParts = (address) => {
    const streetNumberParts = [];

    if (address.street_number) {
        streetNumberParts.push(address.street_number);
    }

    if (address.block) {
        streetNumberParts.push('bloque ' + address.block);
    }

    if (address.stairs) {
        streetNumberParts.push('escalera ' + address.stairs);
    }

    if (address.floor) {
        if (address.door) {
            streetNumberParts.push(address.floor + ' ' + address.door);
        } else {
            streetNumberParts.push(address.floor);
        }
    } else if (address.door) {
        streetNumberParts.push(address.door);
    }

    return joinParts(streetNumberParts);
};

const formatCityParts = (address) => {
    const cityParts = [
        address.postal_code,
        address.city,
        address.province ? `(${address.province})` : null
    ];

    return joinParts(cityParts);
};

export const formatAddress = (address) => {
    if (!address) return '';

    const parts = [
        address.street_name,
        formatStreetNumberParts(address),
        formatCityParts(address),
        address.country
    ];

    return joinParts(parts, ', ');
};

export const formatAddressStreet = (address) => {
    if (!address) return '';

    const parts = [
        address.street_name,
        formatStreetNumberParts(address),
    ];

    return joinParts(parts, ', ');
};

export const formatAddressStreetAndCity = (address) => {
    if (!address) return '';

    const parts = [
        address.street_name,
        formatStreetNumberParts(address),
        address.city,
    ];

    return joinParts(parts, ', ');
};