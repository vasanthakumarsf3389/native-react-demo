// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
//   Children,
//   isValidElement
// } from 'react';
// import { formatUnit, isNullOrUndefined } from '@syncfusion/react-base';
// import { DataManager } from '@syncfusion/react-data';
// import { useGridComputedProvider, useGridMutableProvider } from '../base/Grid';

// /**
// * CSS class names used in the component
// */
// const CSS_CLASS_NAMES = {
//   VISIBLE: '',
//   HIDDEN: 'none'
// };

// /**
// * Custom hook to manage rendering state and data for the grid
// */
// export const useRender = () => {
//   const grid = useGridComputedProvider();
//   const { setCurrentViewData, setInitialLoad } = grid;
//   const { currentViewData } = useGridMutableProvider();

//   const [isLayoutRendered, setIsLayoutRendered] = useState(false);
//   const [isContentBusy, setIsContentBusy] = useState(true);

//   /**
//    * Compute content styles based on grid height
//    */
//   const contentStyles = useMemo(() => ({
//       height: formatUnit(grid.height),
//       overflowY: grid.height === 'auto' ? 'auto' : 'scroll'
//   }), [grid.height]);

//   /**
//    * Create or use existing data manager
//    */
//   const dataManager = useMemo(() => {
//       return grid.dataSource;
//   }, [grid.dataSource]);

//   /**
//    * Handle successful data retrieval
//    */
//   const dataManagerSuccess = useCallback((response) => {
//       const data = response;

//       if (grid.beforeDataBound) {
//           grid.beforeDataBound(data);
//       }

//       if (setCurrentViewData) {
//           setCurrentViewData(data.result);
//       }

//       setIsLayoutRendered(true);
//   }, [grid.beforeDataBound, setCurrentViewData]);

//   /**
//    * Handle data retrieval failure
//    */
//   const dataManagerFailure = useCallback((error) => {
//       setIsContentBusy(true);
//       if (grid.actionFailure) {
//           grid.actionFailure({ error });
//       }
//   }, [grid.actionFailure]);

//   /**
//    * Refresh data from the data manager
//    */
//   const refreshDataManager = useCallback(() => {
//       setIsContentBusy(true);

//       dataManager.executeQuery(grid.query)
//           .then(dataManagerSuccess)
//           .catch(dataManagerFailure);
//   }, [dataManager, grid.query, dataManagerSuccess, dataManagerFailure]);

//   // Initial data load
//   useEffect(() => {
//       refreshDataManager();
//   }, [dataManager, grid.query, grid.columns]);

//   // Handle layout rendered state
//   useEffect(() => {
//       if (isLayoutRendered) {
//           if (grid.hideSpinner) {
//               grid.hideSpinner();
//           }
//           if (grid.dataBound) {
//               grid.dataBound({});
//           }
//           setIsContentBusy(false);
//           setInitialLoad(false);
//       }
//   }, [isLayoutRendered, currentViewData]);

//   // Cleanup on unmount
//   useEffect(() => {
//       return () => {
//           setIsContentBusy(false);
//           setIsLayoutRendered(null);
//       };
//   }, []);

//   // Memoize APIs to prevent unnecessary re-renders
//   const publicRenderAPI = useMemo(() => ({ ...grid }), [grid]);

//   const privateRenderAPI = useMemo(() => ({
//       contentStyles,
//       isLayoutRendered,
//       isContentBusy
//   }), [contentStyles, isLayoutRendered, isContentBusy]);

//   const protectedRenderAPI = useMemo(() => ({
//       refresh: refreshDataManager
//   }), [refreshDataManager]);

//   return {
//       publicRenderAPI,
//       privateRenderAPI,
//       protectedRenderAPI
//   };
// };

// /**
// * Generate a unique key for a column
// */
// const generateUniqueKey = (columnProps, index, prefix = '') => {
//   const baseKey = columnProps.field || columnProps.headerText || 'col';
//   return `${prefix}${baseKey}-${index}`;
// };

// /**
// * Default column properties
// */
// const defaultColumnProps = (props) => {
//   return {
//       visible: true,
//       width: 'auto',
//       textAlign: 'Left',
//       headerTextAlign: 'Left',
//       ...props
//   };
// };

// /**
// * Prepare columns from children or column definitions
// */
// const prepareColumns = (children, parentDepth = 0, parentIndex = '') => {
//   let maxDepth = parentDepth;
//   const columns = [];
//   const adjustedChildren = [];
//   const colGroup = [];
//   const childArray = Array.isArray(children)
//       ? children
//       : Children.toArray(children);

//   for (let i = 0; i < childArray.length; i++) {
//       const child = childArray[i];
//       const currentIndex = parentIndex ? `${parentIndex}-${i}` : `${i}`;

//       if (isValidReactElement(child)) {
//           const columnProps = defaultColumnProps(child.props);
//           const columnKey = generateUniqueKey(columnProps, currentIndex);

//           if (child.props?.children) {
//               const childContents = prepareColumns(
//                   child.props?.children,
//                   parentDepth + 1,
//                   currentIndex
//               );

//               columns.push({ ...columnProps, columns: childContents.columns });
//               colGroup.push(...childContents.colGroup);
//               maxDepth = Math.max(maxDepth, childContents.depth);
//           } else {
//               columns.push(columnProps);

//               colGroup.push(
//                   React.createElement('col', {
//                       key: `col-${columnKey}-${Math.random().toString(36).substr(2, 9)}`,
//                       style: {
//                           width: columnProps.width,
//                           display: columnProps.visible || isNullOrUndefined(columnProps.visible)
//                               ? CSS_CLASS_NAMES.VISIBLE
//                               : CSS_CLASS_NAMES.HIDDEN
//                       }
//                   })
//               );
//           }

//           adjustedChildren.push(
//               React.createElement('div', {
//                   key: `col-base-${columnKey}`,
//                   ...columnProps
//               }, child.props?.children)
//           );
//       } else if (isColumnObject(child)) {
//           const columnObject = defaultColumnProps(child);
//           const columnKey = generateUniqueKey(columnObject, currentIndex, 'obj-');

//           columns.push(columnObject);
//           adjustedChildren.push(
//               React.createElement('div', {
//                   key: columnKey,
//                   ...columnObject
//               })
//           );

//           colGroup.push(
//               React.createElement('col', {
//                   key: `col-${columnKey}-${Math.random().toString(36).substr(2, 9)}`,
//                   style: {
//                       width: columnObject.width,
//                       display: columnObject.visible || isNullOrUndefined(columnObject.visible)
//                           ? CSS_CLASS_NAMES.VISIBLE
//                           : CSS_CLASS_NAMES.HIDDEN
//                   }
//               })
//           );
//       }
//   }

//   if (maxDepth === parentDepth) {
//       maxDepth++;
//   }

//   return {
//       columns,
//       depth: maxDepth,
//       children: React.createElement('div', { key: 'Columns' }, adjustedChildren),
//       colGroup
//   };
// };

// /**
// * Helper function to check if an element is a valid React element
// */
// const isValidReactElement = (element) => {
//   return isValidElement(element);
// };

// /**
// * Helper function to check if an object is a column model
// */
// function isColumnObject(child) {
//   return !isValidReactElement(child) &&
//       typeof child === 'object' &&
//       child !== null &&
//       'field' in child;
// }

// /**
// * Custom hook to process columns from props
// */
// export const useColumns = (props, gridRef) => {
//   const isNoColumnRemoteData = useMemo(() => {
//       return !props.columns && !props.children && props.dataSource instanceof DataManager && props.dataSource.dataSource.url
//           && Array.isArray(gridRef.current?.currentViewData) && gridRef.current?.currentViewData?.length > 0;
//   }, [props.children, props.columns, props.dataSource, gridRef.current?.currentViewData]);
  
//   const { children, depth: headerRowDepth, columns, colGroup } = useMemo(() => {
//       return prepareColumns(
//           props.columns ??
//           props.children ??
//           ((Array.isArray(props.dataSource) && props.dataSource.length > 0)
//               ? Object.keys(props.dataSource[0])
//                   .map((key) => ({
//                       field: key
//                   }))
//               : ((Array.isArray(gridRef.current?.currentViewData) && gridRef.current?.currentViewData?.length > 0)
//                   ? Object.keys(gridRef.current?.currentViewData[0])
//                       .map((key) => ({
//                           field: key
//                       }))
//                   : undefined)
//           )
//       );
//   }, [props.children, props.columns, props.dataSource, isNoColumnRemoteData]);

//   return useMemo(() => ({
//       ...props,
//       columns,
//       headerRowDepth,
//       children,
//       colElements: colGroup
//   }), [props, columns, headerRowDepth, children, colGroup]);
// };

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    // useRef,
    ReactNode,
    Children,
    isValidElement,
    RefObject
} from 'react';
import {
    useGridComputedProvider,
    useGridMutableProvider
} from '../base/Grid';
import { formatUnit, isNullOrUndefined } from '@syncfusion/react-base';
import { DataManager } from '@syncfusion/react-data';
import { Column, ColumnBase } from '../models/Column';
import { defaultColumnProps } from '../models/useColumn';
import { Columns, RenderBase } from './Render';

/**
 * CSS class names used in the component
 */
const CSS_CLASS_NAMES = {
    VISIBLE: '',
    HIDDEN: 'none'
};

/**
 * Custom hook to manage rendering state and data for the grid
 */
export const useRender = () => {
    const grid = useGridComputedProvider();
    const { setCurrentViewData, setInitialLoad } = grid;
    const { currentViewData } = useGridMutableProvider();
    // const isMountedRef = useRef<boolean>(true);

    const [isLayoutRendered, setIsLayoutRendered] = useState(false);
    const [isContentBusy, setIsContentBusy] = useState(true);

    /**
     * Compute content styles based on grid height
     */
    const contentStyles = useMemo(() => ({
        height: formatUnit(grid.height),
        overflowY: grid.height === 'auto' ? 'auto' : 'scroll'
    }), [grid.height]);

    /**
     * Create or use existing data manager
     */
    const dataManager = useMemo(() => {
        return grid.dataSource;
    }, [grid.dataSource]);

    /**
     * Handle successful data retrieval
     */
    const dataManagerSuccess = useCallback((response) => {
        const data = response;

        if (grid.beforeDataBound) {
            grid.beforeDataBound(data);
        }

        if (setCurrentViewData) {
            setCurrentViewData(data.result);
        }

        setIsLayoutRendered(true);
    }, [grid.beforeDataBound, setCurrentViewData]);

    /**
     * Handle data retrieval failure
     */
    const dataManagerFailure = useCallback((error) => {
        setIsContentBusy(true);
        if (grid.actionFailure) {
            grid.actionFailure({ error });
        }
    }, [grid.actionFailure]);

    /**
     * Refresh data from the data manager
     */
    const refreshDataManager = useCallback(() => {
        setIsContentBusy(true);
        // if (grid.showSpinner) {
        //     grid.showSpinner();
        // }

        // requestAnimationFrame(() => {
        dataManager.executeQuery(grid.query)
            .then(dataManagerSuccess)
            .catch(dataManagerFailure);
        // });
    }, [dataManager, grid.query, dataManagerSuccess, dataManagerFailure, grid.showSpinner]);

    // Initial data load
    useEffect(() => {
        refreshDataManager();
    }, [dataManager, grid.query, grid.columns]);

    // Handle layout rendered state
    useEffect(() => {
        if (isLayoutRendered) {
            // requestAnimationFrame(() => {
            if (grid.hideSpinner) {
                grid.hideSpinner();
            }
            if (grid.dataBound) {
                grid.dataBound({});
            }
            setIsContentBusy(false);
            setInitialLoad(false);
            // });
        }
    }, [isLayoutRendered, currentViewData]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setIsContentBusy(false);
            setIsLayoutRendered(null); // Reset state on unmount
        };
    }, []);

    // Memoize APIs to prevent unnecessary re-renders
    const publicRenderAPI = useMemo(() => ({ ...grid }), [grid]);

    const privateRenderAPI = useMemo(() => ({
        contentStyles,
        isLayoutRendered,
        isContentBusy
    }), [contentStyles, isLayoutRendered, isContentBusy]);

    const protectedRenderAPI = useMemo(() => ({
        refresh: refreshDataManager
    }), [refreshDataManager]);

    return {
        publicRenderAPI,
        privateRenderAPI,
        protectedRenderAPI
    };
};

/**
 * Prepare columns from children or column definitions
 *
 * @param {Object[]} children - Child elements or column definitions
 * @param {number} parentDepth - Current depth in the column hierarchy
 * @returns {Object} Object containing columns, depth, children, and column group elements
 */
/**
 * Generate a unique key for a column
 */
const generateUniqueKey =
    (columnProps, index, prefix = '') => {
        // Use field if available, otherwise use headerText, or fallback to index
        const baseKey = columnProps.field || columnProps.headerText || 'col';
        // Add a unique suffix based on the index path to ensure uniqueness
        return `${prefix}${baseKey}-${index}`;
    };

/**
 * Prepare columns from children or column definitions
 *
 * @param {Object[]} children - Child elements or column definitions
 * @param {number} parentDepth - Current depth in the column hierarchy
 * @param {string} parentIndex - Index path for uniqueness
 * @returns {Object} Object containing columns, depth, children, and column group elements
 */
const prepareColumns = (
    children,
    parentDepth = 0,
    parentIndex = ''
) => {
    let maxDepth = parentDepth;
    const columns = [];
    const adjustedChildren = [];
    const colGroup = [];
    const childArray = Array.isArray(children)
        ? children
        : Children.toArray(children);

    for (let i = 0; i < childArray.length; i++) {
        const child = childArray[i];
        const currentIndex = parentIndex ? `${parentIndex}-${i}` : `${i}`;

        if (isValidReactElement(child) && (
            child.type === ColumnBase ||
            child.type === RenderBase ||
            child.type === Columns ||
            child.type === Column
        )) {
            const columnProps = defaultColumnProps(child.props);
            // Generate a unique key for the column
            const columnKey = generateUniqueKey(columnProps, currentIndex);

            if (child.type === ColumnBase || child.type === Column) {
                // Check for and process nested columns
                if ((child.props)?.children) {
                    const childContents = prepareColumns(
                        (child.props)?.children,
                        parentDepth + 1,
                        currentIndex
                    );

                    columns.push({ ...columnProps, columns: childContents.columns }); // Nest child columns
                    colGroup.push(...childContents.colGroup); // Gather col elements from child columns
                    maxDepth = Math.max(maxDepth, childContents.depth);
                } else {
                    columns.push(columnProps);

                    // Only create col elements for leaf columns
                    colGroup.push(
                        <col
                            key={`col-${columnKey}-${Math.random().toString(36).substr(2, 9)}`}
                            style={{
                                width: columnProps.width,
                                display: columnProps.visible || isNullOrUndefined(columnProps.visible)
                                    ? CSS_CLASS_NAMES.VISIBLE
                                    : CSS_CLASS_NAMES.HIDDEN
                            }}
                        />
                    );
                }

                adjustedChildren.push(
                    <ColumnBase key={`col-base-${columnKey}`} {...columnProps}>
                        {(child.props)?.children}
                    </ColumnBase>
                );
            } else if (child.type === RenderBase || child.type === Columns) {
                const {
                    columns: childColumns,
                    depth,
                    colGroup: childColGroup,
                    children
                } = prepareColumns(
                    (child.props)?.children,
                    parentDepth,
                    currentIndex
                );

                columns.push(...childColumns);
                colGroup.push(...childColGroup);
                adjustedChildren.push(
                    ((children).props)?.children
                );
                maxDepth = Math.max(maxDepth, depth);
            }
        } else if (isColumnObject(child)) {
            const columnObject = defaultColumnProps(child);
            const columnKey = generateUniqueKey(columnObject, currentIndex, 'obj-');

            columns.push(columnObject);
            adjustedChildren.push(<ColumnBase key={columnKey} {...columnObject} />);

            // Generate col element for object definitions
            colGroup.push(
                <col
                    key={`col-${columnKey}-${Math.random().toString(36).substr(2, 9)}`}
                    style={{
                        width: columnObject.width,
                        display: columnObject.visible || isNullOrUndefined(columnObject.visible)
                            ? CSS_CLASS_NAMES.VISIBLE
                            : CSS_CLASS_NAMES.HIDDEN
                    }}
                />
            );
        }
    }

    if (maxDepth === parentDepth) {
        maxDepth++;
    }

    return {
        columns,
        depth: maxDepth,
        children: <RenderBase key={'Columns'}>{adjustedChildren}</RenderBase>,
        colGroup
    };
};

/**
 * Helper function to check if an element is a valid React element
 *
 * @param {ReactNode} element - Element to check
 * @returns {boolean} True if the element is a valid React element
 */
const isValidReactElement = (element) => {
    return isValidElement(element);
};

/**
 * Helper function to check if an object is a column model
 * @returns {boolean} True if the object is a column model
 */
function isColumnObject(child) {
    return !isValidReactElement(child) &&
        typeof child === 'object' &&
        child !== null &&
        'field' in child;
}

/**
 * Custom hook to process columns from props
 */
export const useColumns =
    (props, gridRef) => {
        const isNoColumnRemoteData = useMemo(() => {
            return !props.columns && !props.children && props.dataSource instanceof DataManager && props.dataSource.dataSource.url
                && Array.isArray(gridRef.current?.currentViewData) && gridRef.current?.currentViewData?.length > 0;
        }, [props.children, props.columns, props.dataSource, gridRef.current?.currentViewData]);
        const { children, depth: headerRowDepth, columns, colGroup } = useMemo(() => {
            return prepareColumns(
                props.columns ??
                props.children ??
                ((Array.isArray(props.dataSource) && (props.dataSource).length > 0)
                    ? Object.keys((props.dataSource)[0])
                        .map((key) => ({
                            field: key
                        }))
                    : ((Array.isArray(gridRef.current?.currentViewData) && gridRef.current?.currentViewData?.length > 0)
                        ? Object.keys(gridRef.current?.currentViewData[0])
                            .map((key) => ({
                                field: key
                            }))
                        : undefined)
                )
            );
        }, [props.children, props.columns, props.dataSource, isNoColumnRemoteData]);

        return useMemo(() => ({
            ...props,
            columns,
            headerRowDepth,
            children,
            colElements: colGroup
        }), [props, columns, headerRowDepth, children, colGroup]);
    };
