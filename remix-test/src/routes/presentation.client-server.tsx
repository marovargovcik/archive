/* eslint-disable no-console */

import { type V2_MetaFunction } from '@remix-run/node';
import { useEffect, useRef } from 'react';

const meta: V2_MetaFunction = () => [
  {
    title: 'Client-server',
  },
];

const Route = () => {
  if (typeof document === 'undefined') {
    console.log('I am running on a server!');
  } else {
    console.log('I am running on a client!');
  }

  const boxRef = useRef<HTMLDivElement>(null);

  const style = {
    backgroundColor: 'red',
    height: '100px',
    width: '100px',
  };

  useEffect(() => {
    if (boxRef.current === null) {
      return;
    }

    boxRef.current.style.backgroundColor = 'blue';
  }, []);

  return <div ref={boxRef} style={style} />;
};

export { meta };
export default Route;
