import React, { useEffect, useRef, useState } from 'react';
import { IconButton, TextField, Typography } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import { get, has, isEmpty, set, unset } from 'lodash';

export const EditableIONameField = ({
    defaultValue,
    source,
    label,
    customNames,
    setCustomNames,
    autoFocus,
    ioKey,
    deviceID,
    displayEditTextField,
    setDisplayEditTextField,
    ...props
}) => {
    const getCustomName = () =>
        get(customNames, `${deviceID}.${ioKey}.${source}.name`);

    const getName = () => getCustomName() || defaultValue || '';

    const [value, setValue] = useState(getName());

    const inputRef = useRef();
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (displayEditTextField) inputRef.current.focus();
        }, 100);
        return () => clearTimeout(timeout);
    }, [autoFocus, displayEditTextField]);

    const removeCustomName = () => {
        setDisplayEditTextField(false);
        setValue(defaultValue);
        setCustomNames(f => {
            let newCustomNames = { ...f };
            if (has(newCustomNames, `${deviceID}.${ioKey}.${source}.name`)) {
                set(newCustomNames, `${deviceID}.${ioKey}.${source}.name`, '');
            }
            if (
                isEmpty(
                    get(
                        newCustomNames,
                        `${deviceID}.${ioKey}.${source}.channels`
                    )
                )
            ) {
                unset(newCustomNames, `${deviceID}.${ioKey}.${source}`);
            }
            return newCustomNames;
        });
    };

    const saveCustomName = () => {
        setCustomNames(f => {
            let newCustomNames = { ...f };
            if (!has(newCustomNames, `${deviceID}`)) {
                set(newCustomNames, `${deviceID}`, {});
            }
            if (!has(newCustomNames, `${deviceID}.${ioKey}`)) {
                set(newCustomNames, `${deviceID}.${ioKey}`, {});
            }
            if (!has(newCustomNames, `${deviceID}.${ioKey}.${source}`)) {
                set(newCustomNames, `${deviceID}.${ioKey}.${source}`, {
                    name: value,
                    channels: {},
                });
            }
            set(newCustomNames, `${deviceID}.${ioKey}.${source}.name`, value);
            return newCustomNames;
        });
        setDisplayEditTextField(false);
    };

    const cancelCustomName = () => {
        setDisplayEditTextField(false);
        setValue(getName());
    };

    return displayEditTextField ? (
        <div>
            <TextField
                label={label}
                variant="filled"
                margin="dense"
                value={value}
                onChange={event => setValue(event.target.value)}
                inputRef={inputRef}
                fullWidth={true}
                onKeyPress={event => {
                    if (event.key === 'Enter') {
                        saveCustomName();
                    }
                }}
                {...props}
            />
            <IconButton
                size="small"
                onClick={
                    value === defaultValue ? removeCustomName : saveCustomName
                }
            >
                <DoneIcon />
            </IconButton>
            <IconButton size="small" onClick={cancelCustomName}>
                <ClearIcon />
            </IconButton>
        </div>
    ) : (
        <div>
            <Typography variant="body2" display="inline">
                {getName()}
            </Typography>
            <IconButton
                size="small"
                onClick={() => setDisplayEditTextField(true)}
            >
                <CreateIcon />
            </IconButton>
            {getCustomName() && (
                <IconButton size="small" onClick={removeCustomName}>
                    <DeleteIcon />
                </IconButton>
            )}
        </div>
    );
};

export const EditableChannelLabelField = ({
    defaultValue,
    source,
    channelIndex,
    label,
    customNames,
    setCustomNames,
    autoFocus,
    ioKey,
    deviceID,
    displayEditTextField,
    setDisplayEditTextField,
    ...props
}) => {
    const getCustomChannelLabel = () =>
        get(
            customNames,
            `${deviceID}.${ioKey}.${source}.channels.${channelIndex}`
        );

    const getChannelLabel = () => getCustomChannelLabel() || defaultValue || '';

    const [value, setValue] = useState(getChannelLabel());

    const inputRef = useRef();
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (autoFocus) inputRef.current.focus();
        }, 100);
        return () => clearTimeout(timeout);
    }, [autoFocus]);

    const removeCustomChannelLabel = () => {
        setDisplayEditTextField(false);
        setValue(defaultValue);
        setCustomNames(f => {
            let newCustomNames = { ...f };
            unset(
                newCustomNames,
                `${deviceID}.${ioKey}.${source}.channels.${channelIndex}`
            );
            if (
                isEmpty(
                    get(
                        newCustomNames,
                        `${deviceID}.${ioKey}.${source}.channels`
                    )
                ) &&
                get(newCustomNames, `${deviceID}.${ioKey}.${source}.name`) ===
                    ''
            ) {
                unset(newCustomNames, `${deviceID}.${ioKey}.${source}`);
            }
            return newCustomNames;
        });
    };

    const saveCustomChannelLabel = () => {
        setCustomNames(f => {
            let newCustomNames = { ...f };
            if (!has(newCustomNames, `${deviceID}.${ioKey}`)) {
                set(newCustomNames, `${deviceID}.${ioKey}`, {});
            }
            if (!has(newCustomNames, `${deviceID}.${ioKey}.${source}`)) {
                set(newCustomNames, `${deviceID}.${ioKey}.${source}`, {
                    name: '',
                    channels: {},
                });
            }
            set(
                newCustomNames,
                `${deviceID}.${ioKey}.${source}.channels.${channelIndex}`,
                value
            );
            return newCustomNames;
        });
        setDisplayEditTextField(false);
    };

    const cancelCustomChannelLabel = () => {
        setDisplayEditTextField(false);
        setValue(getChannelLabel());
    };

    return displayEditTextField ? (
        <div>
            <TextField
                label={label}
                variant="filled"
                margin="dense"
                value={value}
                onChange={event => setValue(event.target.value)}
                inputRef={inputRef}
                fullWidth={true}
                {...props}
                onKeyPress={event => {
                    if (event.key === 'Enter') {
                        saveCustomChannelLabel();
                    }
                }}
            />
            <IconButton
                size="small"
                onClick={
                    value === defaultValue
                        ? removeCustomChannelLabel
                        : saveCustomChannelLabel
                }
            >
                <DoneIcon />
            </IconButton>
            <IconButton size="small" onClick={cancelCustomChannelLabel}>
                <ClearIcon />
            </IconButton>
        </div>
    ) : (
        <div>
            <Typography variant="body2" display="inline">
                {getChannelLabel()}
            </Typography>
            <IconButton
                size="small"
                onClick={() => setDisplayEditTextField(true)}
            >
                <CreateIcon />
            </IconButton>
            {getCustomChannelLabel() && (
                <IconButton size="small" onClick={removeCustomChannelLabel}>
                    <DeleteIcon />
                </IconButton>
            )}
        </div>
    );
};
