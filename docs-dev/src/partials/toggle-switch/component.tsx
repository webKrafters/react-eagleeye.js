import React, { useMemo } from 'react';

import { Button } from 'antd';

export interface Props {
    className : string,
    isOn? : boolean,
    OffIconType : React.ElementType,
    OnIconType : React.ElementType,
    onToggle? : VoidFunction
};

const ToggleSwitch : React.FC<Props> = ({
    className,
    isOn,
    OffIconType,
    OnIconType,
    onToggle
}) => {
    const props = useMemo(() => {
      const props: {
        className: string,
        icon: React.ReactNode,
        onClick?: VoidFunction
      } = {
        className,
        icon: isOn ? ( <OffIconType /> ) : ( <OnIconType /> )
      };
      if( onToggle ) { props.onClick = onToggle }
      return props;
    }, [ isOn, onToggle ]);
    return ( <Button { ...props } /> );
};

ToggleSwitch.displayName = 'ToggleSwitch';

export default ToggleSwitch;