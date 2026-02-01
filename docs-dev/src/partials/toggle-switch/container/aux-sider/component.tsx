import React from 'react';

import ShrinkOutlinedIcon from '@ant-design/icons/ShrinkOutlined';
import MoreOutlinedIcon from '@ant-design/icons/MoreOutlined';

import ToggleSwitch from '../../component';

import './style.scss';

export interface Props {
    isOn? : boolean;
    onToggle? : VoidFunction; 
};;

const Switch : React.FC<Props> = ({
    isOn = false, onToggle
}) => (
    <ToggleSwitch
        className="aux-sider-toggle-btn"
        isOn={ isOn }
        OffIconType={ ShrinkOutlinedIcon }
        OnIconType={ MoreOutlinedIcon }
        onToggle={ onToggle }
    />
);

Switch.displayName = 'ToggleSwitch.AuxSider';

export default Switch;