/* eslint-disable */
import React, {
  useRef,
  useLayoutEffect,
  useEffect,
  useState
} from 'react';
import { dummyData as dataSource, columns } from './data';
// Import the converted Grid component
import { Grid } from './Grid/base/Grid';
const columns1 = [
  { field: 'Field1', visible: false },
  { field: 'Field2' },
  { field: 'Field3' },
  { field: 'Field4' },
  { field: 'Field5' },
  { field: 'Field6' },
  { field: 'Field7' },
  { field: 'Field8' },
  { field: 'Field9' },
  { field: 'Field10', visible: false },
];
const App = () => {
  const [flag, setFlag] = useState(false);
  const [columnsState, setColumns] = useState(columns);
  const [gridId] = useState(
    () => 'grid-' + Math.random().toString(36).substring(2, 9)
  );
  const gridRef = useRef(null);
  const stTime = useRef(0);
  const edTime = useRef(0);
  const diff = useRef(0);
  const stTime1 = useRef(0);
  const edTime1 = useRef(0);
  const diff1 = useRef(0);

  useLayoutEffect(() => {
    if (flag) {
      stTime1.current = performance.now();
    }
  }, [flag, columnsState]);

  useEffect(() => {
    if (flag && gridRef.current) {
      // Use requestAnimationFrame to ensure measurement happens after painting
      requestAnimationFrame(() => {
        // Use setTimeout with 0ms to push this to the next event loop after rendering
        setTimeout(() => {
          edTime1.current = performance.now();
          diff1.current = parseInt((edTime1.current - stTime1.current).toFixed(0));
          const perfElement = document.getElementById('performanceTime1');
          if (perfElement) {
            perfElement.innerHTML = `Time Taken for Complete Render: <b>${diff1.current}ms</b>`;
          }
        }, 10);
      });
    }
  }, [flag, gridRef.current, columnsState]);

  useEffect(() => {
    // console.log('DOM mounted => ', gridRef.current);
  }, [flag]);

  return (
    <div style={{ marginTop: '80px' }}>
      <div style={{ marginBottom: '10px', display: 'flex' }}>
        <button onClick={() => setFlag(true)} style={{ marginRight: '10px' }}>
          Render Grid
        </button>
        <button onClick={() => {
          setFlag(false);
          setColumns(null);
        }} style={{ marginRight: '10px' }}>
          Destroy Grid
        </button>
        <button
          onClick={() => gridRef.current?.refresh?.()}
          style={{ marginRight: '10px' }}
          disabled={!flag}
        >
          Refresh Grid
        </button>
      </div>
      <div>
        <h2>Native Syncfusion React Grid Component</h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <h4 style={{ margin: 0 }}>Performance Metrics load to dataBound</h4>
          <p id="performanceTime" style={{ margin: 0 }}></p>
          <h4 style={{ margin: 0 }}>Performance Metrics useLayoutEffect to useEffect</h4>
          <p id="performanceTime1" style={{ margin: 0 }}></p>
        </div>
        <div className="e-grid-container" id={gridId}>
          {flag && (
            <Grid
              ref={gridRef}
              dataSource={dataSource}
              columns={columnsState}
              // height="400px"
              // width="100%"
              // allowSelection={true}
              // enableHover={true}
              load={() => {
                console.log('load triggered!');
                stTime.current = performance.now();
              }}
              // actionBegin={() => {
              //     console.log('Native React Grid actionBegin triggered!');
              //     stTime.current = performance.now();
              // }}
              dataBound={() => {
                if (gridRef.current) {
                  edTime.current = performance.now();
                  diff.current = parseInt((edTime.current - stTime.current).toFixed(0));
                  const perfElement = document.getElementById('performanceTime');
                  if (perfElement) {
                    perfElement.innerHTML = `Time Taken for Initial Load: <b>${diff.current}ms</b>`;
                  }
                  stTime.current = 0;
                  edTime.current = 0;
                  diff.current = 0;
                }
              }}
            />
          )}
        </div>
        <button onClick={() => setColumns(columns1)} style={{ marginRight: '10px' }}>column visible state change</button>
        <button>dummy navigation</button>
      </div>
    </div>
  );
};
export default App;