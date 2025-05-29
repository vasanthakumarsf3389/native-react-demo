// import React, {
//   forwardRef,
//   useRef,
//   useImperativeHandle,
//   Children,
//   useMemo,
//   createContext,
//   useContext,
//   useEffect
// } from 'react';
// // import { Spinner } from '@syncfusion/ej2-react-popups';
// // import { Provider } from '@syncfusion/ej2-react-base';
// import { useGridComputedProps } from './useGrid';
// import { RenderBase } from '../renderer/Render';

// /**
// * Context for computed grid properties
// */
// const GridComputedContext = createContext(null);

// /**
// * Provider component for computed grid properties
// */
// const GridComputedProvider = ({ grid, children }) => {
//   return (
//       <GridComputedContext.Provider value={grid}>
//           {children}
//       </GridComputedContext.Provider>
//   );
// };

// /**
// * Hook to access computed grid properties from context
// */
// export const useGridComputedProvider = () => {
//   return useContext(GridComputedContext);
// };

// /**
// * Context for mutable grid properties
// */
// const GridMutableContext = createContext(null);

// /**
// * Provider component for mutable grid properties
// */
// const GridMutableProvider = ({ grid, children }) => {
//   return (
//       <GridMutableContext.Provider value={grid}>
//           {children}
//       </GridMutableContext.Provider>
//   );
// };

// /**
// * Hook to access mutable grid properties from context
// */
// export const useGridMutableProvider = () => {
//   return useContext(GridMutableContext);
// };

// /**
// * `GridBase` provides the internal rendering logic for the root container of the grid.
// * This component supports scrollable layouts, column definition parsing, and loading states.
// */
// const GridBase = forwardRef((props, ref) => {
//   const gridRef = useRef(null);
//   const renderExposedRef = useRef(null);
  
//   // Update gridRef with render properties when they become available
//   useEffect(() => {
//       gridRef.current = {
//           ...gridRef.current,
//           ...renderExposedRef.current,
//           currentViewData: renderExposedRef.current?.getCurrentViewRecords?.(),
//           columns
//       };
//   }, [renderExposedRef.current]);
  
//   const { publicAPI, privateAPI, protectedAPI } = useGridComputedProps(props, gridRef);
//   const { className, id, columns } = publicAPI;
//   const { isLoading, styles, setCurrentViewData, setInitialLoad } = privateAPI;
//   const { columnsDirective } = protectedAPI;

//   // Initialize gridRef with all the properties
//   if (gridRef.current === null) {
//       gridRef.current = {
//           // Grid specific properties
//           element: null,
//           getColumns: () => columns,
//           currentViewData: [],
//           focusModule: protectedAPI.focusModule,
//           selectionModule: protectedAPI.selectionModule,
//           getSelectedRows: () => {
//               return protectedAPI.selectionModule.selectedRecords;
//           },
//           getSelectedRecords: () => {
//               return protectedAPI.selectionModule.getSelectedRecords();
//           },
//           getSelectedRowIndexes: () => {
//               return protectedAPI.selectionModule.getSelectedRowIndexes();
//           },
//           selectRow: (rowIndex, isToggle) => {
//               protectedAPI.selectionModule.selectRow(rowIndex, isToggle);
//           },
//           selectRows: (rowIndexes) => {
//               protectedAPI.selectionModule.selectRows(rowIndexes);
//           },
//           selectRowByRange: (startIndex, endIndex) => {
//               protectedAPI.selectionModule.selectRowByRange(startIndex, endIndex);
//           },
//           clearRowSelection: () => {
//               protectedAPI.selectionModule.clearRowSelection();
//           },
//           // Include all public API computed properties
//           ...publicAPI
//       };
//   }

//   // Expose gridRef directly through ref
//   useImperativeHandle(ref, () => gridRef.current, [gridRef.current]);

//   // Calculate column count for accessibility
//   const colCount = useMemo(() => {
//       return Children.count(columnsDirective.props.children);
//   }, [columnsDirective]);

//   // Memoize render component to prevent unnecessary re-renders
//   const renderComponent = useMemo(() => (
//       <RenderBase
//           ref={renderExposedRef}
//           children={columnsDirective.props.children}
//       />
//   ), [columnsDirective]);

//   return (
//       <GridComputedProvider grid={useMemo(() => ({
//           ...publicAPI, 
//           setCurrentViewData,
//           setInitialLoad
//       }), [publicAPI, setCurrentViewData, setInitialLoad])}>
//           <GridMutableProvider grid={protectedAPI}>
//               <div
//                   ref={(el) => {
//                       gridRef.current.element = el;
//                   }}
//                   id={id}
//                   className={className}
//                   role='grid'
//                   tabIndex={-1}
//                   aria-colcount={colCount}
//                   aria-rowcount={protectedAPI.currentViewData.length}
//                   style={styles}
//                   onKeyDown={privateAPI.handleGridKeyDown}
//                   onClick={privateAPI.handleGridClick}
//                   onFocus={privateAPI.handleGridFocus}
//                   onBlur={privateAPI.handleGridBlur}
//               >
//                   {/* <Spinner visible={isLoading} /> */}
//                   {isLoading && (
//                   <div className="e-grid-loading">
//                     <span className="e-loading-text">Loading...</span>
//                   </div>
//                   )}
//                   {renderComponent}
//               </div>
//           </GridMutableProvider>
//       </GridComputedProvider>
//   );
// });

// /**
// * Grid component that provides a data grid with sorting, filtering, and other features.
// * Wraps the GridBase component with a Provider for localization and RTL support.
// */
// export const Grid = forwardRef((props, ref) => {
//   const { locale, dir = props.enableRtl ? 'rtl' : 'ltr' } = props;
//   return (
//       // <Provider locale={locale} dir={dir}>
//           <GridBase ref={ref} {...props} />
//       // </Provider>
//   );
// });

// export { GridBase };

// Grid.displayName = 'Grid';
// GridBase.displayName = 'GridBase';

import {
    forwardRef,
    useRef,
    useImperativeHandle,
    Children,
    useMemo,
    createContext,
    useContext,
    useEffect
} from 'react';
import { Spinner } from '@syncfusion/react-popups';
import { useGridComputedProps } from './useGrid';
import { RenderBase } from '../renderer/Render';
import {
    // isNullOrUndefined,
    Provider
} from '@syncfusion/react-base';

/**
 * Context for computed grid properties
 */
const GridComputedContext =
    createContext(null);

/**
 * Provider component for computed grid properties
 *
 * @param {Object} props - The provider props
 * @param {Object} props.grid - Grid model and state setter
 * @param {Object} props.children - Child components
 * @returns {Object} Provider component with children
 */
const GridComputedProvider = ({ grid, children }) => {
    return (
        <GridComputedContext.Provider value={grid}>
            {children}
        </GridComputedContext.Provider>
    );
};

/**
 * Hook to access computed grid properties from context
 *
 * @returns {Object} Grid computed context
 */
export const useGridComputedProvider =
    () => {
        return useContext(GridComputedContext);
    };

/**
 * Context for mutable grid properties
 */
const GridMutableContext = createContext(null);

/**
 * Provider component for mutable grid properties
 */
const GridMutableProvider = ({ grid, children }) => {
    return (
        <GridMutableContext.Provider value={grid}>
            {children}
        </GridMutableContext.Provider>
    );
};

/**
 * Hook to access mutable grid properties from context
 */
export const useGridMutableProvider = () => {
    return useContext(GridMutableContext);
};

/**
 * `GridBase` provides the internal rendering logic for the root container of the grid.
 * This component supports scrollable layouts, column definition parsing, and loading states.
 */
const GridBase = forwardRef(
    (props, ref) => {
        const gridRef = useRef(null);
        const renderExposedRef = useRef(null);
        // Update gridRef with render properties when they become available
        useEffect(() => {
            gridRef.current = {
                ...gridRef.current,
                ...renderExposedRef.current,
                currentViewData: renderExposedRef.current.getCurrentViewRecords?.(),
                columns
            };
        }, [renderExposedRef.current]);
        const { publicAPI, privateAPI, protectedAPI } = useGridComputedProps(props, gridRef);
        const { className, id, columns } = publicAPI;
        const { isLoading, styles, setCurrentViewData, setInitialLoad } = privateAPI;
        const { columnsDirective } = protectedAPI;

        // Focus strategy is now managed in useGrid.tsx and passed through protectedAPI

        // Initialize gridRef with all the properties
        if (gridRef.current === null) {
            gridRef.current = {
                // Grid specific properties
                element: null,
                getColumns: () => columns,
                currentViewData: [],
                focusModule: protectedAPI.focusModule,
                selectionModule: protectedAPI.selectionModule,
                getSelectedRows: () => {
                    return protectedAPI.selectionModule.selectedRecords;
                },
                getSelectedRecords: () => {
                    return protectedAPI.selectionModule.getSelectedRecords();
                },
                getSelectedRowIndexes: () =>  {
                    return protectedAPI.selectionModule.getSelectedRowIndexes();
                },
                selectRow: (rowIndex, isToggle) => {
                    protectedAPI.selectionModule.selectRow(rowIndex, isToggle);
                },
                selectRows: (rowIndexes) => {
                    protectedAPI.selectionModule.selectRows(rowIndexes);
                },
                selectRowByRange: (startIndex, endIndex) => {
                    protectedAPI.selectionModule.selectRowByRange(startIndex, endIndex);
                },
                clearRowSelection: () => {
                    protectedAPI.selectionModule.clearRowSelection();
                },
                // Include all public API computed properties
                ...publicAPI
            };
        }

        // Expose gridRef directly through ref
        useImperativeHandle(ref, () => gridRef.current, [gridRef.current]);

        // Calculate column count for accessibility
        const colCount = useMemo(() => {
            return Children.count(((columnsDirective).props).children);
        }, [columnsDirective]);

        // Memoize render component to prevent unnecessary re-renders
        const renderComponent = useMemo(() => (
            <RenderBase
                ref={renderExposedRef}
                children={((columnsDirective).props).children}
            />
        ), [columnsDirective]);

        return (
            <GridComputedProvider grid={useMemo(() => ({
                ...publicAPI, setCurrentViewData,
                setInitialLoad
            }), [publicAPI, setCurrentViewData, setInitialLoad])}>
                <GridMutableProvider grid={protectedAPI}>
                    <div
                        ref={(el) => {
                            gridRef.current.element = el;
                        }}
                        id={id}
                        className={className}
                        role='grid'
                        tabIndex={-1}
                        aria-colcount={colCount}
                        aria-rowcount={protectedAPI.currentViewData?.length}
                        style={styles}
                        onKeyDown={privateAPI.handleGridKeyDown}
                        onClick={privateAPI.handleGridClick}
                        onFocus={privateAPI.handleGridFocus}
                        onBlur={privateAPI.handleGridBlur}
                    >
                        <Spinner visible={isLoading}/>
                        {renderComponent}
                    </div>
                </GridMutableProvider>
            </GridComputedProvider>
        );
    }
);

/**
 * Grid component that provides a data grid with sorting, filtering, and other features.
 * Wraps the GridBase component with a Provider for localization and RTL support.
 */
export const Grid = forwardRef(
    (props, ref) => {
        const { locale, dir = props.enableRtl ? 'rtl' : 'ltr' } = props;
        return (
            <Provider locale={locale} dir={dir}>
                <GridBase ref={ref} {...props} />
            </Provider>
        );
    });

export { GridBase };

Grid.displayName = 'Grid';
GridBase.displayName = 'GridBase';
