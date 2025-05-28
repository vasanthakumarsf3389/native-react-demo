/* eslint-disable */
import React, {
  useRef,
  useLayoutEffect,
  useEffect,
  useState
} from 'react';
import { dummyData as dataSource } from './data';
// Import the converted Grid component
import { Grid } from './Grid/base/Grid';

const App = () => {
  const [flag, setFlag] = useState(false);
  const [gridId] = useState(
    () => 'grid-' + Math.random().toString(36).substring(2, 9)
  );
  const gridRef = useRef(null);
  const stTime = useRef(0);
  const edTime = useRef(0);
  const diff = useRef(0);

  useLayoutEffect(() => {
    if (flag) {
      stTime.current = performance.now();
    }
  }, [flag]);

  useEffect(() => {
    if (flag && gridRef.current) {
      // Measure performance after grid is rendered
      setTimeout(() => {
        edTime.current = performance.now();
        diff.current = parseInt((edTime.current - stTime.current).toFixed(0));
        const perfElement = document.getElementById('performanceTime');
        if (perfElement) {
          perfElement.innerHTML = `Time Taken for Complete Render: <b>${diff.current}ms</b>`;
        }
      }, 100);
    }
  }, [flag, gridRef.current]);

  useEffect(() => {
    // console.log('DOM mounted => ', gridRef.current);
  }, [flag]);

  return (
    <div style={{ marginTop: '80px' }}>
      <div style={{ marginBottom: '10px', display: 'flex' }}>
        <button onClick={() => setFlag(true)} style={{ marginRight: '10px' }}>
          Render Grid
        </button>
        <button onClick={() => setFlag(false)} style={{ marginRight: '10px' }}>
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
          <h4 style={{ margin: 0 }}>Performance Metrics</h4>
          <p id="performanceTime" style={{ margin: 0 }}></p>
        </div>
        <div className="e-grid-container" id={gridId}>
          {flag && (
            <Grid 
              ref={gridRef} 
              dataSource={dataSource} 
              // columns={columns}
              // height="400px"
              // width="100%"
              // allowSelection={true}
              // enableHover={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default App;