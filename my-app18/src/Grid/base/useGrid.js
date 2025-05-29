// import {
//   useCallback,
//   useEffect,
//   useId,
//   useMemo,
//   useRef,
//   useState
// } from 'react';
// import {
//   Browser,
//   formatUnit,
//   L10n,
//   removeClass,
//   // useProviderContext
// } from '@syncfusion/react-base';
// import { useValueFormatter } from '../services/value-formatter';
// import { createServiceLocator } from '../services/service-locator';
// import { DataManager, Query } from '@syncfusion/react-data';
// import { useFocusStrategy } from '../actions/useFocusStrategy';
// import { useColumns } from '../renderer/useRender';
// import { useSelection } from '../actions/useSelection';

// /**
// * Default localization strings for the grid
// */
// const defaultLocale = {
//   EmptyRecord: 'No records to display'
// };

// /**
// * CSS class names used in the Grid component
// */
// const CSS_CLASS_NAMES = {
//   CONTROL: 'e-control',
//   GRID: 'e-grid',
//   RESPONSIVE: 'e-responsive',
//   LIB: 'e-lib',
//   DEFAULT: 'e-default',
//   DROPPABLE: 'e-droppable',
//   TOOLTIP: 'e-tooltip',
//   KEYBOARD: 'e-keyboard',
//   RTL: 'e-rtl',
//   GRID_HOVER: 'e-gridhover',
//   MAC_SAFARI: 'e-mac-safari',
//   DEVICE: 'e-device',
//   MIN_HEIGHT: 'e-grid-min-height',
//   HIDE_LINES: 'e-hidelines',
//   RESIZE_LINES: 'e-resize-lines'
// };

// const KEY_CODES = {
//   ALT_J: 74,
//   ALT_W: 87,
//   ENTER: 13
// };

// /**
// * Custom hook to manage grid state and configuration
// */
// export const useGridComputedProps = (props, gridRef) => {
//   // const baseProvider = useProviderContext();
  
//   const locale = useMemo(() =>
//       props.locale ||
//       // baseProvider?.locale ||
//       'en-US', [
//         props.locale,
//         // baseProvider?.locale
//       ]);
//   const localeObj = useMemo(() =>
//       // L10n('grid', defaultLocale, locale)
//       defaultLocale
//       , [locale]);
//   const valueFormatterService = useValueFormatter(locale);
//   const serviceLocator = useMemo(() => {
//       const locator = createServiceLocator();
//       locator.register('localization', localeObj);
//       locator.register('valueFormatter', valueFormatterService);
//       return locator;
//   }, [localeObj, valueFormatterService]);
  
//   const dataSource = useMemo(() => {
//       if (props.dataSource instanceof DataManager) {
//           return props.dataSource;
//       }
//       else if (Array.isArray(props.dataSource)) {
//           return new DataManager(props.dataSource);
//       }
//       return new DataManager([]);
//   }, [props.dataSource]);
  
//   const query = useMemo(() => new Query(), [props.query]);
  
//   // Trigger load event on initial render
//   useMemo(() => {
//       if (props.load) {
//           props.load({}); // trigger only once on initial render.
//       }
//   }, []);
  
//   const [isInitialLoad, setInitialLoad] = useState(true);
//   const isInitial = useRef(true);
//   if (!isInitial.current && props.actionBegin) {
//       props.actionBegin({});
//       isInitial.current = true;
//   }
  
//   const { children, headerRowDepth, colElements, ...rest } = useColumns(props, gridRef);
//   const stableRest = useRef(rest);
//   const generatedId = useId().replace(/:/g, '');
//   const id = useMemo(() => rest.id || `grid_${generatedId}`, [rest.id, generatedId]);

//   const columns = useMemo(() =>
//       rest.columns, [rest.columns]); //input columns.

//   const height = useMemo(() =>
//       rest.height || 'auto', [rest.height]);
//   const width = useMemo(() =>
//       rest.width || 'auto', [rest.width]);
//   const gridLines = useMemo(() =>
//       rest.gridLines || 'Default', [rest.gridLines]);
//   const allowResizing = useMemo(() =>
//       rest.allowResizing || false, [rest.allowResizing]);
//   const enableRtl = useMemo(() =>
//       rest.enableRtl || false, [rest.enableRtl]);
//   const enableHover = useMemo(() =>
//       rest.enableHover !== false, [rest.enableHover]);
//   const allowSelection = useMemo(() =>
//       rest.allowSelection !== false, [rest.allowSelection]);
//   const selectionSettings = useMemo(() =>
//       ({ ... { type: 'Single', mode: 'Row' }, ...(rest.selectionSettings || {}) }), [rest.selectionSettings]);
//   const rowHeight = useMemo(() =>
//       rest.rowHeight || null, [rest.rowHeight]);
//   const emptyRecordTemplate = useMemo(() =>
//       rest.emptyRecordTemplate || null, [rest.emptyRecordTemplate]);

//   const [currentViewData, setCurrentViewData] = useState([]);

//   /**
//    * Compute CSS class names for the grid
//    */
//   const className = useMemo(() => {
//       const baseClasses = [
//           CSS_CLASS_NAMES.CONTROL,
//           CSS_CLASS_NAMES.GRID,
//           CSS_CLASS_NAMES.RESPONSIVE,
//           CSS_CLASS_NAMES.LIB,
//           CSS_CLASS_NAMES.DEFAULT,
//           CSS_CLASS_NAMES.DROPPABLE,
//           CSS_CLASS_NAMES.TOOLTIP,
//           CSS_CLASS_NAMES.KEYBOARD
//       ];

//       if (enableRtl) {
//           baseClasses.push(CSS_CLASS_NAMES.RTL);
//       }

//       if (gridLines !== 'Default' && gridLines !== 'None') {
//           baseClasses.push(`e-${gridLines.toLowerCase()}lines`);
//       } else if (gridLines === 'None') {
//           baseClasses.push(CSS_CLASS_NAMES.HIDE_LINES);
//           if (allowResizing) {
//               baseClasses.push(CSS_CLASS_NAMES.RESIZE_LINES);
//           }
//       } else if (allowResizing) {
//           baseClasses.push(CSS_CLASS_NAMES.RESIZE_LINES);
//       }

//       if (enableHover) {
//           baseClasses.push(CSS_CLASS_NAMES.GRID_HOVER);
//       }

//       // if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) || Browser.isSafari()) {
//       //     baseClasses.push(CSS_CLASS_NAMES.MAC_SAFARI);
//       // }

//       // if (Browser.isDevice) {
//       //     baseClasses.push(CSS_CLASS_NAMES.DEVICE);
//       // }

//       if (rowHeight) {
//           baseClasses.push(CSS_CLASS_NAMES.MIN_HEIGHT);
//       }

//       if (rest.className) {
//           baseClasses.push(...rest.className.split(' '));
//       }

//       return baseClasses.join(' ');
//   }, [enableRtl, enableHover, rowHeight, gridLines, allowResizing, rest.className, allowSelection, selectionSettings]);

//   /**
//    * Compute CSS styles for the grid container
//    */
//   const styles = useMemo(() => ({
//       width: formatUnit(width)
//   }), [width]);

//   const [isLoading, setIsLoading] = useState(true);

//   /**
//    * Show the loading spinner
//    */
//   const showSpinner = useCallback(() => {
//       setIsLoading(true);
//   }, []);

//   /**
//    * Hide the loading spinner
//    */
//   const hideSpinner = useCallback(() => {
//       setIsLoading(false);
//   }, []);

//   /**
//    * Get the columns directive element
//    */
//   const columnsDirective = useMemo(() => {
//       return children;
//   }, [children]);

//   // Get header and content row counts for focus strategy
//   const headerRowCount = useMemo(() => headerRowDepth, [headerRowDepth]);
//   const contentRowCount = useMemo(() => currentViewData?.length || 0, [currentViewData]);

//   const selectionModule = useSelection(gridRef);

//   // Initialize focus strategy - single source of truth for focus state
//   const focusModule = useFocusStrategy(
//       headerRowCount,
//       contentRowCount,
//       columns,
//       gridRef,
//       {
//           onCellFocus: (args) => {
//               if (rest.onCellFocus) {
//                   rest.onCellFocus(args);
//               }
//           },
//           onCellClick: (args) => {
//               if (rest.onCellClick) {
//                   rest.onCellClick(args);
//               }
//           },
//           beforeCellFocus: (args) => {
//               if (rest.beforeCellFocus) {
//                   rest.beforeCellFocus(args);
//               }
//           }
//       }
//   );

//   const keyDownHandler = useCallback((e) => {
//       if (e.altKey) {
//           if (e.keyCode === KEY_CODES.ALT_J) {//alt j
//               const currentInfo = focusModule?.getFocusInfo();
//               if (currentInfo && currentInfo.element) {
//                   removeClass([currentInfo.element, currentInfo.elementToFocus],
//                               ['e-focused', 'e-focus']);
//                   currentInfo.element.tabIndex = -1;
//               }
//               gridRef.current?.element.focus();
//           }
//           if (e.keyCode === KEY_CODES.ALT_W) {//alt w
//               // First ensure we're in content mode
//               focusModule.setActiveMatrix(true);

//               // Focus the content area
//               focusModule.focusContent();

//               // Add outline to the focused cell
//               focusModule.addOutline();

//               // Prevent default browser behavior
//               e.preventDefault();
//           }
//       }
//   }, [focusModule, gridRef.current?.currentViewData]);

//   const handleGridClick = useCallback((e) => {
//       focusModule.handleGridClick(e);
//       selectionModule.handleGridClick(e);
//   }, [focusModule, selectionModule]);

//   const handleGridFocus = useCallback((e) => {
//       // When the grid receives focus, set grid focus state and focus first cell if needed
//       if (focusModule && !focusModule.isGridFocused) {
//           focusModule.setGridFocus(true);

//           // Determine if focus is coming from before or after the grid
//           const relatedTarget = e.relatedTarget;
//           const gridElement = gridRef.current.element;

//           const isClickInsideGrid = e.target.tabIndex !== 0
//               && gridElement.contains(e.target) && gridElement !== e.target;
//           if (isClickInsideGrid) { return; }
          
//           // Check if we can determine the focus direction
//           let isForwardTabbing = true;

//           if (relatedTarget) {
//               // Try to determine if we're tabbing forward or backward
//               const allFocusableElements = Array.from(document.querySelectorAll(
//                   'div.e-grid, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
//               ));

//               const gridIndex = allFocusableElements.indexOf(gridElement);
//               const relatedIndex = allFocusableElements.indexOf(relatedTarget);

//               if (gridIndex > -1 && relatedIndex > -1) {
//                   isForwardTabbing = relatedIndex < gridIndex;
//               }
//           }

//           // Only navigate to a cell if no cell is currently focused
//           const { focusedCell } = focusModule;
//           if (focusedCell.rowIndex === -1 && focusedCell.colIndex === -1) {
//               // Use requestAnimationFrame to ensure the DOM is ready
//               requestAnimationFrame(() => {
//                   if (isForwardTabbing) {
//                       // Focus the first cell when tabbing forward into the grid
//                       focusModule.navigateToFirstCell();
//                   } else {
//                       // Focus the last cell when tabbing backward into the grid
//                       focusModule.navigateToLastCell();
//                   }
//               });
//           }
//       }
//   }, [focusModule]);

//   const handleGridBlur = useCallback((e) => {
//       // When the grid loses focus, update grid focus state
//       if (focusModule && focusModule.isGridFocused) {
//           // Check if focus is staying within the grid or related elements
//           const relatedTarget = e.relatedTarget;

//           const isStayingInGrid =
//               // Focus moving to another element within the grid
//               (e.currentTarget.contains(relatedTarget) ||
//                   // Focus moving to a grid popup
//                   (relatedTarget && relatedTarget.closest('.e-grid-popup')) ||
//                   // Focus still within the grid (using document.activeElement)
//                   document.activeElement && document.activeElement.closest('.e-grid'));

//           if (!isStayingInGrid) {
//               // Clear focus completely when leaving the grid
//               focusModule.clearIndicator();
//               focusModule.removeFocus();
//               focusModule.setGridFocus(false);
//           }
//       }
//   }, [focusModule]);

//   const handleGridKeyDown = useCallback((e) => {
//       // Handle keyboard navigation
//       const { focusedCell } = focusModule;

//       // Check if we're on the first header cell and pressing Shift+Tab
//       const isFirstHeaderCell = focusedCell.isHeader &&
//           focusedCell.rowIndex === focusModule.firstFocusableActiveCellIndex?.[0] &&
//           focusedCell.colIndex === focusModule.firstFocusableActiveCellIndex?.[1];
//       const isShiftTab = e.key === 'Tab' && e.shiftKey;

//       // Check if we're on the last content cell and pressing Tab
//       const isLastContentCell = !focusedCell.isHeader &&
//           focusedCell.rowIndex === focusModule.lastFocusableActiveCellIndex?.[0] &&
//           focusedCell.colIndex === focusModule.lastFocusableActiveCellIndex?.[1];
//       const isTab = e.key === 'Tab' && !e.shiftKey;

//       // If we're on the first header cell and pressing Shift+Tab, or
//       // on the last content cell and pressing Tab, let the default behavior happen
//       if ((isFirstHeaderCell && isShiftTab) || (isLastContentCell && isTab)) {
//           // Clear focus completely
//           focusModule.clearIndicator();
//           focusModule.removeFocus();
//           focusModule.setGridFocus(false);

//           // Don't prevent default to allow natural tab navigation
//           return;
//       }

//       // Otherwise, handle navigation normally
//       focusModule.handleKeyDown(e);
//   }, [focusModule]);

//   useEffect(() => {
//       if (!isInitialLoad) {
//           isInitial.current = false;
//       }
//   }, [currentViewData, isInitialLoad]);

//   // Initialize grid and handle cleanup
//   useEffect(() => {
//       document.body.addEventListener('keydown', keyDownHandler);
//       // Set up focus management when grid mounts
//       focusModule.setFirstFocusableTabIndex();
//       if (rest.created) {
//           rest.created({}); // trigger only once on initial render, once Dom element mounted.
//       }
//       return () => {
//           document.body.removeEventListener('keydown', keyDownHandler);
//           serviceLocator.unregisterAll();
//           setCurrentViewData(null);
//           isInitial.current = null;
//           setInitialLoad(null);
//           setIsLoading(null);
//       }; // cleanup function, if any.
//   }, []);

//   // Only update the ref if rest has meaningfully changed
//   useEffect(() => {
//       stableRest.current = rest;
//   }, [rest]);

//   /**
//    * Private API for internal grid operations
//    */
//   const privateAPI = useMemo(() => ({
//       isLoading,
//       styles,
//       setCurrentViewData,
//       setInitialLoad,
//       handleGridClick,
//       handleGridFocus,
//       handleGridBlur,
//       handleGridKeyDown
//   }), [isLoading, styles, setCurrentViewData, handleGridClick]);

//   /**
//    * Public API exposed to consumers of the grid
//    */
//   const publicAPI = useMemo(() => ({
//       ...stableRest.current,
//       showSpinner,
//       hideSpinner,
//       serviceLocator,
//       className,
//       dataSource,
//       id,
//       height,
//       children,
//       width,
//       enableRtl,
//       enableHover,
//       allowSelection,
//       selectionSettings,
//       rowHeight,
//       columns,
//       locale,
//       query,
//       emptyRecordTemplate
//   }), [
//       showSpinner,
//       hideSpinner,
//       serviceLocator,
//       className,
//       dataSource,
//       id,
//       height,
//       children,
//       width,
//       enableRtl,
//       enableHover,
//       allowSelection,
//       selectionSettings,
//       rowHeight,
//       columns,
//       locale,
//       query,
//       emptyRecordTemplate,
//       rest
//   ]);

//   /**
//    * Protected API for internal grid components
//    */
//   const protectedAPI = useMemo(() => ({
//       currentViewData,
//       columnsDirective,
//       headerRowDepth,
//       colElements,
//       isInitialLoad,
//       focusModule,
//       selectionModule
//   }), [currentViewData, columnsDirective, headerRowDepth, colElements, isInitialLoad, focusModule, selectionModule]);

//   useEffect(() => {
//       gridRef.current = {
//           ...gridRef.current,
//           ...publicAPI
//       };
//   }, [publicAPI]);

//   return { privateAPI, publicAPI, protectedAPI };
// };

// src/base/useGridProps.tsx
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Browser,
  formatUnit,
  L10n,
  removeClass,
  useProviderContext
} from '@syncfusion/react-base';
import { useValueFormatter } from '../services/value-formatter';
import { createServiceLocator } from '../services/service-locator';
import { DataManager, Query } from '@syncfusion/react-data';
import { useFocusStrategy } from '../actions/useFocusStrategy';
import { useColumns } from '../renderer/useRender';
import { useSelection } from '../actions/useSelection';

/**
* Default localization strings for the grid
*/
const defaultLocale = {
  EmptyRecord: 'No records to display'
};

/**
* CSS class names used in the Grid component
*/
const CSS_CLASS_NAMES = {
  CONTROL: 'e-control',
  GRID: 'e-grid',
  RESPONSIVE: 'e-responsive',
  LIB: 'e-lib',
  DEFAULT: 'e-default',
  DROPPABLE: 'e-droppable',
  TOOLTIP: 'e-tooltip',
  KEYBOARD: 'e-keyboard',
  RTL: 'e-rtl',
  GRID_HOVER: 'e-gridhover',
  MAC_SAFARI: 'e-mac-safari',
  DEVICE: 'e-device',
  MIN_HEIGHT: 'e-grid-min-height',
  HIDE_LINES: 'e-hidelines',
  RESIZE_LINES: 'e-resize-lines'
};

const KEY_CODES = {
  ALT_J: 74,
  ALT_W: 87,
  ENTER: 13
};

/**
* Custom hook to manage grid state and configuration
*/
export const useGridComputedProps = (
  props,
  gridRef
) => {
  const baseProvider = useProviderContext();
  
  const locale = useMemo(() =>
      props.locale || baseProvider.locale
  , [
      props.locale,
      baseProvider.locale
    ]);
  const localeObj = useMemo(() =>
      L10n('grid', defaultLocale, locale)
    //   defaultLocale
  , [locale]);
  const valueFormatterService = useValueFormatter(locale);
  const serviceLocator = useMemo(() => {
      const locator = createServiceLocator();
      locator.register('localization', localeObj);
      locator.register('valueFormatter', valueFormatterService);
      return locator;
  }, [localeObj, valueFormatterService]);
  const dataSource = useMemo(() => {
      if (props.dataSource instanceof DataManager) {
          return props.dataSource;
      }
      else if (Array.isArray(props.dataSource)) {
          return new DataManager(props.dataSource);
      }
      return new DataManager([]);
  }, [props.dataSource]);
  
  const query = useMemo(() => new Query(), [props.query]);
  // Trigger load event on initial render
  useMemo(() => {
      if (props.load) {
          props.load({}); // trigger only once on initial render.
      }
  }, []);
  const [isInitialLoad, setInitialLoad] = useState(true);
  const isInitial = useRef(true);
  if (!isInitial.current && props.actionBegin) {
      props.actionBegin({});
      isInitial.current = true;
  }
  const { children, headerRowDepth, colElements, ...rest } = useColumns(props, gridRef);
  const stableRest = useRef(rest);
  const generatedId = useId().replace(/:/g, '');
  const id = useMemo(() => rest.id || `grid_${generatedId}`, [rest.id, generatedId]);

  const columns = useMemo(() =>
      rest.columns, [rest.columns]); //input columns.

  const height = useMemo(() =>
      rest.height || 'auto', [rest.height]);
  const width = useMemo(() =>
      rest.width || 'auto', [rest.width]);
  const gridLines = useMemo(() =>
      rest.gridLines || 'Default', [rest.gridLines]);
  const allowResizing = useMemo(() =>
      rest.allowResizing || false, [rest.allowResizing]);
  const enableRtl = useMemo(() =>
      rest.enableRtl || false, [rest.enableRtl]);
  const enableHover = useMemo(() =>
      rest.enableHover !== false, [rest.enableHover]);
  const allowSelection = useMemo(() =>
      rest.allowSelection !== false, [rest.allowSelection]);
  const selectionSettings = useMemo(() =>
      ({ ... { type: 'Single', mode: 'Row' }, ...(rest.selectionSettings || {}) }), [rest.selectionSettings]);
  const rowHeight = useMemo(() =>
      rest.rowHeight || null, [rest.rowHeight]);
  const emptyRecordTemplate = useMemo(() =>
      rest.emptyRecordTemplate || null, [rest.emptyRecordTemplate]);

  const [currentViewData, setCurrentViewData] = useState([]);

  /**
   * Compute CSS class names for the grid
   */
  const className = useMemo(() => {
      const baseClasses = [
          CSS_CLASS_NAMES.CONTROL,
          CSS_CLASS_NAMES.GRID,
          CSS_CLASS_NAMES.RESPONSIVE,
          CSS_CLASS_NAMES.LIB,
          CSS_CLASS_NAMES.DEFAULT,
          CSS_CLASS_NAMES.DROPPABLE,
          CSS_CLASS_NAMES.TOOLTIP,
          CSS_CLASS_NAMES.KEYBOARD
      ];

      if (enableRtl) {
          baseClasses.push(CSS_CLASS_NAMES.RTL);
      }

      if (gridLines !== 'Default' && gridLines !== 'None') {
          baseClasses.push(`e-${gridLines.toLowerCase()}lines`);
      } else if (gridLines === 'None') {
          baseClasses.push(CSS_CLASS_NAMES.HIDE_LINES);
          if (allowResizing) {
              baseClasses.push(CSS_CLASS_NAMES.RESIZE_LINES);
          }
      } else if (allowResizing) {
          baseClasses.push(CSS_CLASS_NAMES.RESIZE_LINES);
      }

      if (enableHover) {
          baseClasses.push(CSS_CLASS_NAMES.GRID_HOVER);
      }

      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) || Browser.isSafari()) {
          baseClasses.push(CSS_CLASS_NAMES.MAC_SAFARI);
      }

      if (Browser.isDevice) {
          baseClasses.push(CSS_CLASS_NAMES.DEVICE);
      }

      if (rowHeight) {
          baseClasses.push(CSS_CLASS_NAMES.MIN_HEIGHT);
      }

      if (rest.className) {
          baseClasses.push(...rest.className.split(' '));
      }

      return baseClasses.join(' ');
  }, [enableRtl, enableHover, rowHeight, gridLines, allowResizing, rest.className, allowSelection, selectionSettings]);

  /**
   * Compute CSS styles for the grid container
   */
  const styles = useMemo(() => ({
      width: formatUnit(width)
  }), [width]);

  const [isLoading, setIsLoading] = useState(true);

  /**
   * Show the loading spinner
   */
  const showSpinner = useCallback(() => {
      setIsLoading(true);
  }, []);

  /**
   * Hide the loading spinner
   */
  const hideSpinner = useCallback(() => {
      setIsLoading(false);
  }, []);

  /**
   * Get the columns directive element
   */
  const columnsDirective = useMemo(() => {
      return children;
  }, [children]);

  // Get header and content row counts for focus strategy
  const headerRowCount = useMemo(() => headerRowDepth, [headerRowDepth]);
  const contentRowCount = useMemo(() => currentViewData?.length || 0, [currentViewData]);

  const selectionModule = useSelection(gridRef);

  // Initialize focus strategy - single source of truth for focus state
  const focusModule = useFocusStrategy(
      headerRowCount,
      contentRowCount,
      columns,
      gridRef,
      {
          onCellFocus: (args) => {
              if (rest.onCellFocus) {
                  rest.onCellFocus(args);
              }
          },
          onCellClick: (args) => {
              if (rest.onCellClick) {
                  rest.onCellClick(args);
              }
          },
          beforeCellFocus: (args) => {
              if (rest.beforeCellFocus) {
                  rest.beforeCellFocus(args);
              }
          }
      }
  );

  const keyDownHandler = useCallback((e) => {
      if (e.altKey) {
          if (e.keyCode === KEY_CODES.ALT_J) {//alt j
              const currentInfo = focusModule?.getFocusInfo();
              if (currentInfo && currentInfo.element) {
                  removeClass([currentInfo.element, currentInfo.elementToFocus],
                              ['e-focused', 'e-focus']);
                  currentInfo.element.tabIndex = -1;
              }
              // if (gridRef.current && !gridRef.current.element.classList.contains('e-childgrid')) {
              gridRef.current?.element.focus();
              // }
          }
          if (e.keyCode === KEY_CODES.ALT_W) {//alt w
              // First ensure we're in content mode
              focusModule.setActiveMatrix(true);

              // Focus the content area
              focusModule.focusContent();

              // Add outline to the focused cell
              focusModule.addOutline();

              // Prevent default browser behavior
              e.preventDefault();
          }
      }
      // if (e.keyCode === KEY_CODES.ENTER) {
      //     // Handle Enter key if needed
      //     // This is included for completeness based on the original code
      // }
  }, [focusModule, gridRef.current?.currentViewData]);

  const handleGridClick = useCallback((e) => {
      // if (focusModule) {
      focusModule.handleGridClick(e);
      selectionModule.handleGridClick(e);
      // }
  }, [focusModule, selectionModule]);

  const handleGridFocus = useCallback((e) => {
      // When the grid receives focus, set grid focus state and focus first cell if needed
      if (focusModule && !focusModule.isGridFocused) {
          focusModule.setGridFocus(true);

          // Determine if focus is coming from before or after the grid
          const relatedTarget = e.relatedTarget;
          const gridElement = gridRef.current.element;

          const isClickInsideGrid = (e.target).tabIndex !== 0
              && gridElement.contains(e.target) && gridElement !== e.target;
          // Check if we can determine the focus direction
          let isForwardTabbing = true;

          if (relatedTarget) {
              // Try to determine if we're tabbing forward or backward
              // This is a heuristic and may not be 100% accurate in all cases
              const allFocusableElements = Array.from(document.querySelectorAll(
                  'div.e-grid, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
              ));

              const gridIndex = allFocusableElements.indexOf(gridElement);
              const relatedIndex = allFocusableElements.indexOf(relatedTarget);

              if (gridIndex > -1 && relatedIndex > -1) {
                  isForwardTabbing = relatedIndex < gridIndex;
              }
          }
          if (isClickInsideGrid && isForwardTabbing) { return; }
          // Only navigate to a cell if no cell is currently focused
          const { focusedCell } = focusModule;
          if (focusedCell.rowIndex === -1 && focusedCell.colIndex === -1) {
              if (!isForwardTabbing) {
                    focusModule.setActiveMatrix(true);
                    requestAnimationFrame(() => {
                        focusModule.focus();
                    });
                    return;
                } else {
                    // Use requestAnimationFrame to ensure the DOM is ready
                    requestAnimationFrame(() => {
                        // Focus the first cell when tabbing forward into the grid
                        focusModule.navigateToFirstCell();
                    });
                }
          }
      }
  }, [focusModule]);

  const handleGridBlur = useCallback((e) => {
      // When the grid loses focus, update grid focus state
      // Only if focus is truly moving outside the grid
      if (focusModule && focusModule.isGridFocused) {
          // Check if focus is staying within the grid or related elements
          const relatedTarget = e.relatedTarget;

          // Don't remove focus if:
          // 1. Focus is moving to another element within the grid
          // 2. Focus is moving to a grid popup
          // 3. Focus is moving to a specific element that should maintain grid focus
          const isStayingInGrid =
              // Focus moving to another element within the grid
              (e.currentTarget.contains(relatedTarget) ||
                  // Focus moving to a grid popup
                  (relatedTarget && relatedTarget.closest('.e-grid-popup')) ||
                  // Focus still within the grid (using document.activeElement)
                  document.activeElement && document.activeElement.closest('.e-grid'));

          if (!isStayingInGrid) {
              // Clear focus completely when leaving the grid
              focusModule.clearIndicator();
              focusModule.removeFocus();
              focusModule.setGridFocus(false);
          }
      }
  }, [focusModule]);

  const handleGridKeyDown = useCallback((e) => {
      if ((e.key === 'Shift' && e.shiftKey) || (e.key === 'Control' && e.ctrlKey)) { return; }
      // Handle keyboard navigation
      // Get the active matrix to determine boundaries
      // const activeMatrix = focusModule.getActiveMatrix();
      const { getFocusInfo } = focusModule;
      const focusedCell = getFocusInfo();

      // Check if we're on the first header cell and pressing Shift+Tab
      const isFirstHeaderCell = focusedCell.isHeader &&
          focusedCell.rowIndex === focusModule.firstFocusableActiveCellIndex?.[0] &&
          focusedCell.colIndex === focusModule.firstFocusableActiveCellIndex?.[1];
      const isShiftTab = e.key === 'Tab' && e.shiftKey;

      // Check if we're on the last content cell and pressing Tab
      const isLastContentCell = !focusedCell.isHeader &&
          focusedCell.rowIndex === focusModule.lastFocusableActiveCellIndex?.[0] &&
          focusedCell.colIndex === focusModule.lastFocusableActiveCellIndex?.[1];
      const isTab = e.key === 'Tab' && !e.shiftKey;

      // If we're on the first header cell and pressing Shift+Tab, or
      // on the last content cell and pressing Tab, let the default behavior happen
      if ((isFirstHeaderCell && isShiftTab) || (isLastContentCell && isTab)) {
          // Clear focus completely
          focusModule.clearIndicator();
          focusModule.removeFocus();
          focusModule.setGridFocus(false);

          // Don't prevent default to allow natural tab navigation
          return;
      }

      // Otherwise, handle navigation normally
      focusModule.handleKeyDown(e);
  }, [focusModule]);

  useEffect(() => {
      if (!isInitialLoad) {
          isInitial.current = false;
      }
  }, [currentViewData, isInitialLoad]);

  // Initialize grid and handle cleanup
  useEffect(() => {
      document.body.addEventListener('keydown', keyDownHandler);
      // Set up focus management when grid mounts
      // Set the first focusable element's tabIndex to 0
      focusModule.setFirstFocusableTabIndex();
      if (rest.created) {
          rest.created({}); // trigger only once on initial render, once Dom element mounted.
      }
      return () => {
          document.body.removeEventListener('keydown', keyDownHandler);
          serviceLocator.unregisterAll();
          setCurrentViewData(null);
          isInitial.current = null;
          setInitialLoad(null);
          setIsLoading(null);
      }; // cleanup function, if any.
  }, []);

  // Only update the ref if rest has meaningfully changed
  useEffect(() => {
      stableRest.current = rest;
  }, [rest]); // we might use a custom comparison for rest here to avoid re-render.

  /**
   * Private API for internal grid operations
   */
  const privateAPI = useMemo(() => ({
      isLoading,
      styles,
      setCurrentViewData,
      setInitialLoad,
      handleGridClick,
      handleGridFocus,
      handleGridBlur,
      handleGridKeyDown
  }), [isLoading, styles, setCurrentViewData, handleGridClick]);

  /**
   * Public API exposed to consumers of the grid
   * Always keep memorized public APIs for Grid component context provider
   * This will prevent unnecessary re-rendering of child components
   * These are for readonly purpose - if a property needs to be updated,
   * it should not be included here but in the protected API
   */
  const publicAPI = useMemo(() => ({
      ...stableRest.current,
      showSpinner,
      hideSpinner,
      serviceLocator,
      className,
      dataSource,
      id,
      height,
      children,
      width,
      enableRtl,
      enableHover,
      allowSelection,
      selectionSettings,
      rowHeight,
      columns,
      locale,
      query,
      emptyRecordTemplate
  }), [
      showSpinner,
      hideSpinner,
      serviceLocator,
      className,
      dataSource,
      id,
      height,
      children,
      width,
      enableRtl,
      enableHover,
      allowSelection,
      selectionSettings,
      rowHeight,
      columns,
      locale,
      query,
      emptyRecordTemplate,
      rest
  ]);

  /**
   * Protected API for internal grid components
   */
  const protectedAPI = useMemo(() => ({
      currentViewData,
      columnsDirective,
      headerRowDepth,
      colElements,
      isInitialLoad,
      focusModule,
      selectionModule
  }), [currentViewData, columnsDirective, headerRowDepth, colElements, isInitialLoad, focusModule, selectionModule]);

  useEffect(() => {
      gridRef.current = {
          ...gridRef.current,
          ...publicAPI
      };
  }, [publicAPI]);

  return { privateAPI, publicAPI, protectedAPI };
};
