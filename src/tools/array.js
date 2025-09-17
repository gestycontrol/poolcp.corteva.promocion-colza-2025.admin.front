export const range = (start, end, step = 1) => {
    let range = [];
    let isNegativeStep = step < 0;

    if (isNegativeStep) {
        [start, end, step] = [end, start, -step];
    }

    for (let i = start; i <= end; i += step) {
        range.push(i);
    }

    if (isNegativeStep) {
        range.reverse();
    }

    return range;
}
