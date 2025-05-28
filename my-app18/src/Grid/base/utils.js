// import { isNullOrUndefined } from '@syncfusion/react-base';
// import { DataUtil } from '@syncfusion/react-data';

// let uid = 0;

// function headerValueAccessor(headerText, column) {
//     return DataUtil.getObject(headerText, column);
// }

// function getUid(prefix) {
//     return prefix + uid++;
// }

// function valueAccessor(field, data, _column) {
//     return (isNullOrUndefined(field) || field === '') ? '' : DataUtil.getObject(field, data);
// }

// export { headerValueAccessor, getUid, valueAccessor };


import { isNullOrUndefined, isUndefined } from '@syncfusion/react-base';
import { DataUtil } from '@syncfusion/react-data';

/**
 * Function to get value from provided data
 * @hidden
 */

// eslint-disable-next-line
export function valueAccessor(field, data, _column) {
    return (isNullOrUndefined(field) || field === '') ? '' : DataUtil.getObject(field, data);
}

/**
 * Defines the method used to apply custom header cell values from external function and display this on each header cell rendered.
 * @hidden
 */
export function headerValueAccessor(headerText, column) {
    return DataUtil.getObject(headerText, column);
}

/**
 * @param {string} field - Defines the Field
 * @param {Object} object - Defines the objec
 * @returns {string | number | boolean | Object | undefined} Returns the object
 * @hidden
 */
export const getObject =
    (field, object) => {
        let value = object;
        const splits = field.split('.');
        for (let i = 0; i < splits.length && !isNullOrUndefined(value); i++) {
            const key = splits[i];
            value = value[key];
            if (isUndefined(value) && object) {
                const pascalCase = key.charAt(0).toUpperCase() + key.slice(1);
                const camelCase = key.charAt(0).toLowerCase() + key.slice(1);
                value = object[pascalCase] || object[camelCase];
            }
        }
        return value;
    };

export const setStringFormatter =
    (fmtr, type, format) => {
        let args = {};
        if (type === 'date' || type === 'datetime' || type === 'dateonly') {
            const actualType = type === 'dateonly' ? 'date' : type;
            args = { type: actualType, skeleton: format };
            if (typeof format === 'string' && format !== 'yMd') {
                // (args as { [key: string]: string })[`${format}`] = format;
                (args)['format'] = format;
            }
        }
        switch (type) {
        case 'date':
        case 'dateonly':
        case 'datetime':
            return fmtr.getFormatFunction?.(args);
        case 'number':
            return fmtr.getFormatFunction?.({ format: format });
        default:
            return undefined;
        }
    };

let uid = 0;
/**
 * @param {string} prefix - Defines the prefix string
 * @returns {string} Returns the uid
 * @hidden
 */
export function getUid(prefix) {
    return prefix + uid++;
}
