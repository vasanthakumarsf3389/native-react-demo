// import React, {
//   forwardRef,
//   useImperativeHandle,
//   useRef,
//   useLayoutEffect,
//   useMemo,
//   memo
// } from 'react';
// import { HeaderPanelBase } from './HeaderPanel';
// import { ContentPanelBase } from './ContentPanel';
// import { useRender } from './useRender';
// import { useScroll } from '../actions/useScroll';

// /**
// * CSS class names used in the Render component
// */
// const CSS_CLASS_NAMES = {
//   GRID_HEADER: 'e-gridheader e-lib e-droppable',
//   HEADER_CONTENT: 'e-headercontent',
//   GRID_CONTENT: 'e-gridcontent',
//   CONTENT: 'e-content'
// };

// /**
// * Custom hook to synchronize scroll elements between header and content panels
// */
// const useSyncScrollElements = (
//   headerRef,
//   contentRef,
//   setHeaderElement,
//   setContentElement,
//   setPadding
// ) => {
//   useLayoutEffect(() => {
//       const headerElement = headerRef.current?.headerScrollRef;
//       setHeaderElement(headerElement);

//       const contentElement = contentRef.current?.contentScrollRef;
//       setContentElement(contentElement);
//       setPadding();

//       return () => {
//           setHeaderElement(null);
//           setContentElement(null);
//       };
//   }, [headerRef, contentRef, setHeaderElement, setContentElement, setPadding]);
// };

// /**
// * Base component for rendering the grid structure with header and content panels
// */
// const RenderBase = memo(
//   forwardRef((_props, ref) => {
//       const headerPanelRef = useRef(null);
//       const contentPanelRef = useRef(null);

//       const { privateRenderAPI, protectedRenderAPI } = useRender();
//       const { privateScrollAPI, protectedScrollAPI, setHeaderScrollElement, setContentScrollElement } = useScroll();
//       const { setPadding } = protectedScrollAPI;
//       const { headerContentBorder, headerPadding, onContentScroll, onHeaderScroll } = privateScrollAPI;

//       // Synchronize scroll elements between header and content panels
//       useSyncScrollElements(
//           headerPanelRef,
//           contentPanelRef,
//           setHeaderScrollElement,
//           setContentScrollElement,
//           setPadding
//       );

//       // Expose methods and properties through ref
//       useImperativeHandle(ref, () => ({
//           // Render specific methods
//           refresh: protectedRenderAPI.refresh,
//           scrollModule: protectedScrollAPI,
//           // Forward all properties from header and content panels
//           ...headerPanelRef.current,
//           ...contentPanelRef.current
//       }), [
//           protectedRenderAPI.refresh,
//           headerPanelRef.current,
//           contentPanelRef.current
//       ]);

//       // Memoize header panel to prevent unnecessary re-renders
//       const headerPanel = useMemo(() => (
//           <HeaderPanelBase
//               ref={headerPanelRef}
//               panelAttributes={{
//                   style: headerPadding,
//                   className: CSS_CLASS_NAMES.GRID_HEADER
//               }}
//               scrollContentAttributes={{
//                   style: headerContentBorder,
//                   className: CSS_CLASS_NAMES.HEADER_CONTENT,
//                   onScroll: onHeaderScroll
//               }}
//           />
//       ), [headerPadding, headerContentBorder, onHeaderScroll]);

//       // Memoize content panel to prevent unnecessary re-renders
//       const contentPanel = useMemo(() => (
//           <ContentPanelBase
//               ref={contentPanelRef}
//               setHeaderPadding={setPadding}
//               panelAttributes={{
//                   className: CSS_CLASS_NAMES.GRID_CONTENT
//               }}
//               scrollContentAttributes={{
//                   className: CSS_CLASS_NAMES.CONTENT,
//                   style: privateRenderAPI.contentStyles,
//                   'aria-busy': privateRenderAPI.isContentBusy,
//                   onScroll: onContentScroll
//               }}
//           />
//       ), [setPadding, privateRenderAPI.contentStyles, privateRenderAPI.isContentBusy, onContentScroll]);

//       return (
//           <>
//               {headerPanel}
//               {contentPanel}
//           </>
//       );
//   })
// );

// /**
// * Columns component that wraps RenderBase for external usage
// */
// export const Columns = ({ children }) => {
//   return null;
// };

// export { RenderBase };

// RenderBase.displayName = 'RenderBase';


import {
    forwardRef,
    useImperativeHandle,
    useRef,
    useLayoutEffect,
    useMemo,
    memo
} from 'react';
import { HeaderPanelBase } from './HeaderPanel';
import { ContentPanelBase } from './ContentPanel';
import { useRender } from './useRender';
import { useScroll } from '../actions/useScroll';

/**
 * CSS class names used in the Render component
 */
const CSS_CLASS_NAMES = {
    GRID_HEADER: 'e-gridheader e-lib e-droppable',
    HEADER_CONTENT: 'e-headercontent',
    GRID_CONTENT: 'e-gridcontent',
    CONTENT: 'e-content'
};

/**
 * Custom hook to synchronize scroll elements between header and content panels
 *
 * @param {Object} headerRef - Reference to the header panel
 * @param {Object} contentRef - Reference to the content panel
 * @param {Function} setHeaderElement - Function to set the header scroll element
 * @param {Function} setContentElement - Function to set the content scroll element
 * @param {Function} setPadding - Function to set padding for scroll elements
 * @returns {void}
 */
const useSyncScrollElements = (
    headerRef,
    contentRef,
    setHeaderElement,
    setContentElement,
    setPadding
) => {
    useLayoutEffect(() => {
        const headerElement = headerRef.current?.headerScrollRef;
        setHeaderElement(headerElement);

        const contentElement = contentRef.current?.contentScrollRef;
        // if (contentElement) {
        setContentElement(contentElement);
        setPadding();
        // }

        return () => {
            setHeaderElement(null);
            setContentElement(null);
        };
    }, [headerRef, contentRef, setHeaderElement, setContentElement, setPadding]);
};

/**
 * Base component for rendering the grid structure with header and content panels
 *
 * @component
 */
const RenderBase = memo(forwardRef((_props, ref) => {
    const headerPanelRef = useRef(null);
    const contentPanelRef = useRef(null);

    const { privateRenderAPI, protectedRenderAPI } = useRender();
    const { privateScrollAPI, protectedScrollAPI, setHeaderScrollElement, setContentScrollElement } = useScroll();
    const { setPadding } = protectedScrollAPI;
    const { headerContentBorder, headerPadding, onContentScroll, onHeaderScroll } = privateScrollAPI;

    // Synchronize scroll elements between header and content panels
    useSyncScrollElements(
        headerPanelRef,
        contentPanelRef,
        setHeaderScrollElement,
        setContentScrollElement,
        setPadding
    );

    // Expose methods and properties through ref
    useImperativeHandle(ref, () => ({
        // Render specific methods
        refresh: protectedRenderAPI.refresh,
        scrollModule: protectedScrollAPI,
        // Forward all properties from header and content panels
        ...(headerPanelRef.current),
        ...(contentPanelRef.current)
    }), [
        protectedRenderAPI.refresh,
        headerPanelRef.current,
        contentPanelRef.current
    ]);

    // Memoize header panel to prevent unnecessary re-renders
    const headerPanel = useMemo(() => (
        <HeaderPanelBase
            ref={headerPanelRef}
            panelAttributes={{
                style: headerPadding,
                className: CSS_CLASS_NAMES.GRID_HEADER
            }}
            scrollContentAttributes={{
                style: headerContentBorder,
                className: CSS_CLASS_NAMES.HEADER_CONTENT,
                onScroll: onHeaderScroll
            }}
        />
    ), [headerPadding, headerContentBorder, onHeaderScroll]);

    // Memoize content panel to prevent unnecessary re-renders
    const contentPanel = useMemo(() => (
        <ContentPanelBase
            ref={contentPanelRef}
            setHeaderPadding={setPadding}
            panelAttributes={{
                className: CSS_CLASS_NAMES.GRID_CONTENT
            }}
            scrollContentAttributes={{
                className: CSS_CLASS_NAMES.CONTENT,
                style: privateRenderAPI.contentStyles,
                'aria-busy': privateRenderAPI.isContentBusy,
                onScroll: onContentScroll
            }}
        />
    ), [setPadding, privateRenderAPI.contentStyles, privateRenderAPI.isContentBusy, onContentScroll]);

    return (
        <>
            {headerPanel}
            {contentPanel}
        </>
    );
})
);

/**
 * Columns component that wraps RenderBase for external usage
 */
export const Columns = () => {
    return null;
};

export {
    RenderBase
};

// Columns.displayName = 'Columns';
RenderBase.displayName = 'RenderBase';
