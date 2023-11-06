import * as React from 'react';

import { ConnectViewProps } from './Connect.types';

export default function ConnectView(props: ConnectViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
