// import { useMemo } from 'react';
// import { Internationalization } from '@syncfusion/react-base';

// /**
//  * Custom hook for value formatting service
//  * @param {string} locale - The locale to use for formatting
//  * @returns {Object} Value formatter service
//  */
// export const useValueFormatter = (locale) => {
//     return useMemo(() => {
//         const intl = Internationalization(locale);
        
//         return {
//             /**
//              * Converts a string value from the view to a typed value
//              * @param {string} value - The string value to convert
//              * @param {Function} format - The format function to use
//              * @param {string} target - Optional target type
//              * @returns {string | number | Date} The converted value
//              */
//             fromView: (value, format, target) => {
//                 if (!format || typeof format !== 'function') {
//                     return value;
//                 }
//                 return format(value);
//             },

//             /**
//              * Converts a typed value to a string for display in the view
//              * @param {number | Date} value - The value to format
//              * @param {Function} format - The format function to use
//              * @returns {string | Object} The formatted value
//              */
//             toView: (value, format) => {
//                 if (!format || typeof format !== 'function') {
//                     return value?.toString() || '';
//                 }
//                 return format(value);
//             },

//             /**
//              * Sets the culture for formatting
//              * @param {string} cultureName - The culture name to set
//              */
//             setCulture: (cultureName) => {
//                 // Implementation for setting culture
//             },

//             /**
//              * Gets a format function for the specified format options
//              * @param {Object} format - The format options
//              * @returns {Function} The format function
//              */
//             getFormatFunction: (format) => {
//                 if (typeof format === 'string') {
//                     return (value) => intl.formatDate(value, { format });
//                 }
//                 return (value) => value?.toString() || '';
//             },

//             /**
//              * Gets a parser function for the specified format options
//              * @param {Object} format - The format options
//              * @returns {Function} The parser function
//              */
//             getParserFunction: (format) => {
//                 return (value) => {
//                     if (typeof value === 'string') {
//                         const parsed = parseFloat(value);
//                         return isNaN(parsed) ? value : parsed;
//                     }
//                     return value;
//                 };
//             }
//         };
//     }, [locale]);
// };

import { getDateFormat, getDateParser, getNumberFormat, getNumberParser, isNullOrUndefined } from '@syncfusion/react-base';
import { setCulture } from '@syncfusion/react-base';
import { useMemo } from 'react';
/**
 * Custom hook that provides value formatting capabilities for various types of data
 *
 * @param {string} cultureName - The culture name to use for formatting
 * @returns {Object} An IValueFormatter instance
 */
export const useValueFormatter = (cultureName) => {
    const formatter = useMemo(() => ({
        getFormatFunction: (format) => {
            try {
                if (!isNullOrUndefined(format) &&
                    ((format).type === 'dateTime' ||
                        (format).type === 'datetime' ||
                        (format).type === 'date' ||
                        (format).type === 'time')) {
                    return getDateFormat(cultureName, format);
                } else {
                    return getNumberFormat(cultureName, format);
                }
            } catch (error) {
                console.error('Error creating format function:', error);
                return () => '';
            }
        },
        getParserFunction: (format) => {
            try {
                if ((format).type) {
                    return getDateParser(cultureName, format);
                } else {
                    return getNumberParser(cultureName, format);
                }
            } catch (error) {
                console.error('Error creating parser function:', error);
                return () => '';
            }
        },
        fromView: (value, format, type) => {
            try {
                if ((type === 'date' || type === 'datetime' || type === 'number') &&
                    (!isNullOrUndefined(format)) &&
                    (!isNullOrUndefined(value))) {
                    return format(value);
                } else {
                    return value;
                }
            } catch (error) {
                console.error('Error converting from view:', error);
                return value;
            }
        },
        toView: (value, format) => {
            try {
                return format(value);
            } catch (error) {
                console.error('Error converting to view:', error);
                return value?.toString();
            }
        },
        setCulture: (cultureName) => {
            setCulture(cultureName);
        }
    }), [cultureName]);
    return formatter;
};
