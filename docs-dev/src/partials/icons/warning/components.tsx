import React, { memo } from 'react';

import WarningTwoToneIcon from '@ant-design/icons/WarningTwoTone';

const Component : React.MemoExoticComponent<React.FC> = memo(() => (
    <WarningTwoToneIcon
        style={{ fontSize: 24 }}
        twoToneColor={[ '#f40', '#fd0' ]}
    />
));
Component.displayName = 'WarningIcon';

export default Component;