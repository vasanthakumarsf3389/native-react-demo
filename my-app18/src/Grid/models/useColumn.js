import { isValidElement, ReactElement, useMemo } from 'react';
import { formatUnit, isNullOrUndefined } from '@syncfusion/react-base';
import { CellType } from '../base/enum';
import { useGridComputedProvider } from '../base/Grid'; 
import { setStringFormatter, getObject } from '../base/utils';
import { getUid, headerValueAccessor as defaultHeaderValueAccessor, valueAccessor as defaultValueAccessor } from '../base/utils';
/**
 * CSS class names used in the Column component
 */
const CSS_CLASS_NAMES = {
    LEFT_ALIGN: 'e-leftalign',
    RIGHT_ALIGN: 'e-rightalign',
    CENTER_ALIGN: 'e-centeralign',
    HIDDEN: 'e-hide'
};
/**
 * Applies default column properties to the provided column configuration

 */
export const defaultColumnProps = (props) => {
    // computed values should handle in component inside alone since react not allowed us to compute here using memo.
    return {
        ...props,
        width: props.width ? formatUnit(props.width) : '',
        valueAccessor: props.valueAccessor ?? defaultValueAccessor,
        headerValueAccessor: props.headerValueAccessor ?? defaultHeaderValueAccessor,
        type: props.type === 'none' ? null : (props.type ? (typeof (props.type) === 'string' ? props.type.toLowerCase() : undefined) : props.type),
        uid: isNullOrUndefined(props.uid) ? getUid('grid-column') : props.uid,
        // setFormatter: (value: Function) => { props.formatFn = value; },
        getFormatter: props.formatFn,
        // setParser: (value: Function) => { props.parseFn = value; },
        getParser: props.parseFn
    };
};
/**
 * `useColumn` is a custom hook that provides column configuration and formatting logic for grid columns.
 * It handles value formatting, alignment classes, visibility, and template rendering.
 */
export const useColumn = (props) => {
    const {
        cell,
        row
    } = props;
    const {
        column,
        cellType
    } = cell;
    const {
        customAttributes,
        field,
        width,
        headerText,
        headerTemplate,
        template,
        valueAccessor,
        headerValueAccessor,
        format,
        type,
        textAlign,
        visible,
        headerTextAlign,
        ...rest
    } = column;
    const { serviceLocator } = useGridComputedProvider();
    const formatter = serviceLocator?.getService('valueFormatter');
    /**
     * Formats a value according to the column's type and format specification
     *
     * @type {(value: string | Object | null) => string}
     */
    const formatValue = useMemo(() => {
        return (value) => {
            let updatedType = type;
            if (!isNullOrUndefined(format) && formatter) {
                // Handle number validation
                if (type === 'number' && typeof value === 'string' && isNaN(parseInt(value, 10))) {
                    return '';
                }
                // Auto-detect type if not specified
                if (!isNullOrUndefined(value) && !type) {
                    updatedType = value instanceof Date && !isNullOrUndefined(value.getDay) ?
                        ((value.getHours() || value.getMinutes() || value.getSeconds() || value.getMilliseconds()) ? 'datetime' : 'date') :
                        typeof value;
                }
                // Get appropriate formatter function
                const formatterFn = typeof format === 'string' ?
                    setStringFormatter(formatter, updatedType, format) :
                    formatter.getFormatFunction?.(format);

                value = formatter.toView(value, formatterFn);
            }
            return String(value);
        };
    }, [type, format, formatter]);
    /**
     * Computes the CSS class for header alignment
     *
     * @type {string}
     */
    const alignHeaderClass = useMemo(() => {
        const alignment = (headerTextAlign ?? textAlign ?? 'Left').toLowerCase();
        return `e-${alignment}align`;
    }, [headerTextAlign, textAlign]);
    /**
     * Computes the CSS class for cell alignment
     *
     * @type {string}
     */
    const alignClass = useMemo(() => {
        const alignment = (textAlign ?? 'Left').toLowerCase();
        return `e-${alignment}align`;
    }, [textAlign]);
    /**
     * Computes visibility class and updates style attributes
     *
     * @type {string}
     */
    const visibleClass = useMemo(() => {
        if (CellType.Data === cellType && customAttributes) {
            customAttributes.style = {
                ...customAttributes.style,
                display: visible || isNullOrUndefined(visible) ? '' : 'none'
            };
        }
        return visible || isNullOrUndefined(visible) ? '' : ` ${CSS_CLASS_NAMES.HIDDEN}`;
    }, [visible, cellType, customAttributes]);
    /**
     * Retrieves the raw value from the data row based on field
     *
     * @type {string | number | boolean | Object | undefined}
     */
    const value = useMemo(() => {
        return (cellType === CellType.Data && field && row && row.isDataRow) ?
            getObject(field, row.data) :
            undefined;
    }, [cellType, field, row]);
    /**
     * Computes the formatted value for display, handling templates and type conversions
     *
     * @type {string | ReactElement}
     */
    const formattedValue = useMemo(() => {
        let formattedVal = '';
        // Handle header cell formatting
        if (cellType === CellType.Header) {
            if (isNullOrUndefined(headerTemplate)) {
                formattedVal = headerValueAccessor('headerText', column);
            } else if (typeof headerTemplate === 'string' || isValidElement(headerTemplate)) {
                return headerTemplate;
            } else {
                return headerTemplate({ field: field, headerText: headerText });
            }
        }
        // Handle data cell formatting
        else {
            if (isNullOrUndefined(template)) {
                formattedVal = valueAccessor?.(field, row.data);
            } else if (typeof template === 'string' || isValidElement(template)) {
                return template;
            } else {
                return template({ field: field, rowData: row.data });
            }
        }
        // Apply type-specific formatting for values
        if (value) {
            if ((type === 'date' || type === 'datetime') && !isNullOrUndefined(value)) {
                formattedVal = new Date(value);
            }
            if (type === 'dateonly' && typeof value === 'string') {
                const arr = value.split(/[^0-9.]/);
                formattedVal = new Date(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, parseInt(arr[2], 10));
            }
            return formatValue(formattedVal);
        } else {
            return formattedVal;
        }
    }, [
        value,
        field,
        row,
        cellType,
        template,
        headerTemplate,
        headerText,
        type,
        valueAccessor,
        headerValueAccessor,
        formatValue
    ]);
    /**
     * Private API for internal component use
     *
     * @type {{ cellType: CellType, row: Object, alignClass: string, alignHeaderClass: string, visibleClass: string, formattedValue: string | ReactElement }}
     */
    const privateAPI = useMemo(() => ({
        cellType,
        row,
        alignClass,
        alignHeaderClass,
        visibleClass,
        formattedValue
    }), [cellType, row, alignClass, alignHeaderClass, visibleClass, formattedValue]);
    /**
     * Public API exposed to parent components
     */
    const publicAPI = useMemo(() => ({
        field,
        headerText,
        textAlign,
        headerTextAlign,
        format,
        width: formatUnit(width || ''),
        customAttributes,
        visible,
        ...rest
    }), [field, headerText, textAlign, headerTextAlign, format, width, customAttributes, visible, rest]);
    return { publicAPI, privateAPI };
};
