// Usage analytics via GoatCounter (https://www.goatcounter.com): cookie-free,
// no personal data stored. See the "Analytics" section of README.md.
//
// Set this to your GoatCounter site code (the "xyz" in xyz.goatcounter.com).
// Leave it empty to turn analytics off.
export const GOATCOUNTER_CODE = 'eharpste';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ENABLED = Boolean(GOATCOUNTER_CODE) && IS_PRODUCTION;
const SCRIPT_ID = 'goatcounter-script';

// Calls made before count.js has loaded wait here.
let queue = [];
let sentFirstPageview = false;

function send(vars) {
    if (!ENABLED) {
        if (!IS_PRODUCTION) {
            console.debug('[analytics]', vars.event ? 'event' : 'pageview', vars.path, vars.title || '');
        }
        return;
    }
    if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count(vars);
    } else {
        queue.push(vars);
    }
}

export function initAnalytics() {
    if (!ENABLED || document.getElementById(SCRIPT_ID)) {
        return;
    }
    const endpoint = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;

    // no_onload: this is a hash-routed single-page app, so pageviews are
    // counted by trackPageview() on each route change instead.
    window.goatcounter = Object.assign({}, window.goatcounter, { no_onload: true, endpoint });

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = 'https://gc.zgo.at/count.js';
    script.setAttribute('data-goatcounter', endpoint);
    script.onload = () => {
        const pending = queue;
        queue = [];
        pending.forEach(vars => window.goatcounter.count(vars));
    };
    document.head.appendChild(script);
}

export function trackPageview(path, title) {
    // Only the first pageview carries the external referrer (undefined lets
    // count.js use document.referrer); later in-app navigations send none so
    // one visit from e.g. a course site isn't counted as many referrals.
    const referrer = sentFirstPageview ? '' : undefined;
    sentFirstPageview = true;
    send({ path, title: title || '', referrer });
}

// GoatCounter events have no custom properties: `name` is the event's path
// (must not start with "/") and `title` carries any detail.
export function trackEvent(name, title) {
    send({ path: name, title: title || '', referrer: '', event: true });
}

export function cardLabel(card) {
    return card ? `${card.id}: ${card.principle}` : '';
}

export function slug(text) {
    return String(text).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
