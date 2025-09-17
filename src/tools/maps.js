import $env from '@/tools/environment.js';

let googleMapsScriptInserted = false;

export const insertGoogleMapsScript = () => {
    const google_api_key = $env('VITE_GOOGLE_API_KEY');

    if (!window.nothingToDo) {
        window.nothingToDo = () => { };
    }

    if (googleMapsScriptInserted || !google_api_key) {
        return;
    }

    googleMapsScriptInserted = true;
    let googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${google_api_key}&libraries=places&callback=nothingToDo`;
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    window.document.body.appendChild(googleMapsScript);
};

export const removeGoogleMapsScript = () => {
    const googleMapsScript = document.querySelector('script[src*="https://maps.googleapis.com"]');

    if (googleMapsScript) {
        googleMapsScript.remove();
    }

    googleMapsScriptInserted = false;
};