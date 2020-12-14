import React from 'react';
import { useFormState } from 'react-final-form';
import { Button } from '@material-ui/core';
import { Toolbar } from 'react-admin';
import get from 'lodash/get';
import {
    ActivateImmediateIcon,
    ActivateScheduledIcon,
    CancelScheduledActivationIcon,
    StageIcon,
} from '../icons';

const MappingEditToolbar = ({ handleSubmitWithRedirect ,id}) => {
    const formState = useFormState().values;
    const buttonProps = (() => {
        if (get(formState, '$staged.activation.activation_time')) {
            return [
                'Cancel Scheduled Activation',
                <CancelScheduledActivationIcon />,
                `/devices/${id}/show/Staged_Matrix`,
            ];
        }
        switch (get(formState, '$staged.activation.mode')) {
            case 'activate_immediate':
                return ['Activate', <ActivateImmediateIcon />, `/devices/${id}/show/Active_Matrix`];
            case 'activate_scheduled_relative':
            case 'activate_scheduled_absolute':
                return ['Activate Scheduled', <ActivateScheduledIcon />, `/devices/${id}/show/Staged_Matrix`,];
            default:
                return ['Stage', <StageIcon />, `/devices/${id}/show/Staged_Matrix`,];
        }
    })();
    return (
        <Toolbar>
            <>
                <Button
                    onClick={() => handleSubmitWithRedirect()}
                    variant="contained"
                    color="primary"
                    disabled={
                        get(formState, '$staged.activation.activation_time') &&
                        get(formState, '$staged.activation.mode') !== null
                    }
                    redirect={buttonProps[2]}
                    startIcon={buttonProps[1]}
                >
                    {buttonProps[0]}
                </Button>
            </>
        </Toolbar>
    );
};

export default MappingEditToolbar;
