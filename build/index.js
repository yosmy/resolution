'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.resolve = exports.navigation = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var navigation = _propTypes2.default.shape({
    location: _propTypes2.default.string.isRequired,
    payload: _propTypes2.default.object,
    onNavigate: _propTypes2.default.func.isRequired // (location, callback)
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
var resolve = function resolve(location, pages) {
    /* Find by location */

    var page = pages.filter(function (_ref) {
        var enabled = _ref.enabled;

        return enabled !== false;
    }).find(function (page) {
        if (!Array.isArray(page.location)) {
            page.location = [page.location];
        }

        return page.location.find(function (loc) {
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
        page = pages.find(function (page) {
            return typeof page.default !== 'undefined' && page.default === true;
        });
    }

    // Is there a default?
    if (typeof page !== 'undefined') {
        return page.element();
    }

    var error = '\nCan\'t find a route for ' + location + '.';

    throw new Error(error);
};

exports.navigation = navigation;
exports.resolve = resolve;
