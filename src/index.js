import PropTypes from 'prop-types';

const navigation = PropTypes.shape({
    location: PropTypes.string.isRequired,
    payload: PropTypes.object,
    onNavigate: PropTypes.func.isRequired, // (location, callback)
}).isRequired;

/**
 * @param {string} location,
 * @param {Array.<{
 *      location: string|RegExp|Array,
 *      element: function,
 *      enabled: boolean,
 *      default: boolean
 * }>} pages
 */
const resolve = (
    location,
    pages
) => {
    /* Find by location */

    let page = pages
        .filter(({enabled}) => {
            return enabled !== false
        })
        .find((page) => {
            if (!Array.isArray(page.location)) {
                page.location = [page.location];
            }

            return page.location.find((loc) => {
                // Is string?
                if (typeof loc === 'string') {
                    // Exact match
                    return loc === location;
                }

                // Is regex
                return loc.exec(location);
            });
        });

    // Found it?
    if (typeof page !== 'undefined') {
        return page.element();
    }

    /* Default */

    if (typeof page === 'undefined') {
        page = pages.find((page) => {
            return (
                typeof page.default !== 'undefined'
                && page.default === true
            );
        });
    }

    // Is there a default?
    if (typeof page !== 'undefined') {
        return page.element();
    }

    let error = `\nCan't find a route for ${location}.`;

    throw new Error(error);
};

export {navigation, resolve};