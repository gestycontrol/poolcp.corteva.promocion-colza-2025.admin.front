export const generateCodeFromName = (name) => {
    if (!name) {
        return '';
    }

    const minLength = 5;
    const wordsToIgnore = ['UN', 'DE', 'EL', 'LA', 'DEL', 'L'];

    const cleanName = name.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .replace('-', ' ')
        .replace('.', '')
        .replace("'", ' ')
        .replace('"', ' ')
        .replace('(', ' ')
        .replace(')', ' ')
        .replace(';', ' ')
        .replace(':', ' ')
        .replace('!', ' ')
        .replace('?', ' ');
    const words = cleanName.split(/\s+/).filter(word =>
        word.length > 0 && !wordsToIgnore.includes(word)
    );

    if (words.length === 0 || words.join('').length < minLength) {
        return '';
    }

    const codeParts = words.map(word => word[0]);
    let charIndex = 1;

    while (codeParts.join('').length < minLength) {
        for (let i = 0; i < words.length; i++) {
            if (words[i].length > charIndex) {
                codeParts[i] += words[i][charIndex];

                if (codeParts.join('').length >= minLength) {
                    break;
                }
            }
        }

        charIndex++;
    }

    return codeParts.join('');
}; 