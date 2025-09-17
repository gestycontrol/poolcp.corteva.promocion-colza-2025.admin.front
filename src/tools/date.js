export const formatDate = (date_str) => {
    if (!date_str) return '';

    let date;

    if (typeof (date_str) == 'string') {
        date = new Date(date_str.split('.')[0]);
    } else {
        date = date_str;
    }

    return ('0' + date.getDate()).slice(-2) + '/' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
        date.getFullYear();
};

export const formatTime = (date_str) => {
    if (!date_str) return '';

    let date;

    if (typeof (date_str) == 'string') {
        let new_date_str = date_str;

        if (new_date_str.includes(':') && !new_date_str.includes('-')) {
            new_date_str = '2000-01-01 ' + new_date_str;
        }

        date = new Date(new_date_str);
    } else {
        date = date_str;
    }

    return (date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes().toString());
};

export const dateDiff = (date_str1, date_str2) => {
    if (!date_str1) return '';

    let date1, date2;

    if (typeof (date_str1) == 'string') {
        date1 = new Date(date_str1.split('.')[0]);
    } else {
        date1 = date_str1;
    }

    if (!date_str2) date_str2 = new Date();

    if (typeof (date_str2) == 'string') {
        date2 = new Date(date_str2.split('.')[0]);
    } else {
        date2 = date_str2;
    }

    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);
    date2.setHours(0);
    date2.setMinutes(0);
    date2.setSeconds(0);

    let diff = Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));

    return (diff > 0 ? diff : 0).toString();
};

export const combineDateAndTime = (date_str, time_str) => {
    if (!date_str) return null;
    if (!time_str) time_str = '00:00';

    let date = new Date(date_str);
    date.setHours(parseInt(time_str.split(':')[0]));
    date.setMinutes(parseInt(time_str.split(':')[1]));

    return date;
};

export const combineDateAndTimeISO = (date_str, time_str) => {
    let date = combineDateAndTime(date_str, time_str);

    if (!date) return '';

    return formatDateLocalISO(date);
};

export const nowISO = () => {
    return formatDateLocalISO(new Date());
};

export const formatDateLocalISO = (date) => {
    let timezoneOffset = (new Date(date)).getTimezoneOffset() * 60000;

    return (new Date(date - timezoneOffset)).toISOString().slice(0, -1);
};

export const formatDateTime = (date_str) => {
    if (!date_str) return '';

    return formatDate(date_str) + ' ' + formatTime(date_str);
};