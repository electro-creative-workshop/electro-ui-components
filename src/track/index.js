/* global dataLayer */

const send = (event, data) => {
    if (typeof dataLayer === 'undefined') {
        return;
    }

    data = data || {};
    data.event = event;

    if (process.env.NODE_ENV === 'development') {
        console.log(
            JSON.stringify(data, undefined, 4)
        );
    }

    dataLayer.push(data);
}

export { send };