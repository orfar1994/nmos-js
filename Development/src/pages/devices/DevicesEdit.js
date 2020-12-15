import React, { Fragment } from 'react';
import { Link, Route } from 'react-router-dom';
import { Paper, Tab, Tabs } from '@material-ui/core';
import {
    Edit,
    FormDataConsumer,
    SelectInput,
    SimpleForm,
    TextInput,
} from 'react-admin';
import get from 'lodash/get';
import set from 'lodash/set';
import ClearIcon from '@material-ui/icons/Clear';
import { useTheme } from '@material-ui/styles';
import MappingEditActions from '../../components/MappingEditActions';
import MappingEditToolbar from '../../components/MappingEditToolbar';
import ChannelMappingMatrix from './ChannelMappingMatrix';

const DevicesTitle = ({ record }) => {
    return (
        <span>
            Device:{' '}
            {record
                ? record.label
                    ? `${record.label}`
                    : `${record.id}`
                : 'Unknown'}
        </span>
    );
};

const DevicesEdit = props => {
    const theme = useTheme();
    const tabBackgroundColor =
        theme.palette.type === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900];
    return (
        <>
            <div style={{ display: 'flex' }}>
                <Paper
                    style={{
                        alignSelf: 'flex-end',
                        background: tabBackgroundColor,
                    }}
                >
                    <Tabs
                        value={props.location.pathname}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab
                            label="Summary"
                            component={Link}
                            to={`${props.basePath}/${props.id}/show/`}
                        />
                        <Tab
                            label="Active Matrix"
                            component={Link}
                            to={`${props.basePath}/${props.id}/show/Active_Matrix`}
                        />
                        <Tab
                            label="Staged Matrix"
                            value={`${props.match.url}`}
                            component={Link}
                            to={`${props.basePath}/${props.id}/show/Staged_Matrix`}
                        />
                    </Tabs>
                </Paper>
                <span style={{ flexGrow: 1 }} />
                <MappingEditActions {...props} />
            </div>
            <Route
                exact
                path={`${props.basePath}/${props.id}/`}
                render={() => <EditStagedTab {...props} />}
            />
        </>
    );
};

const EditStagedTab = props => {
    const [RedirectToActive, SetRedirectToActive] = React.useState(true);
    return (
        <Edit
            {...props}
            undoable={false}
            title={<DevicesTitle />}
            actions={<Fragment />}
        >
            <SimpleForm
                toolbar={<MappingEditToolbar id={props.id} />}
                redirect={
                    RedirectToActive
                        ? `/devices/${props.id}/show/Active_Matrix`
                        : `/devices/${props.id}/show/Staged_Matrix`
                }
            >
                <SelectInput
                    label="Activation Mode"
                    source="$staged.activation.mode"
                    choices={[
                        { id: null, name: <ClearIcon /> },
                        {
                            id: 'activate_immediate',
                            name: 'activate_immediate',
                        },
                        {
                            id: 'activate_scheduled_relative',
                            name: 'activate_scheduled_relative',
                        },
                        {
                            id: 'activate_scheduled_absolute',
                            name: 'activate_scheduled_absolute',
                        },
                    ]}
                    translateChoice={false}
                />
                <FormDataConsumer>
                    {({ formData, ...rest }) => {
                        switch (get(formData, '$staged.activation.mode')) {
                            case 'activate_scheduled_relative':
                                SetRedirectToActive(false);
                                return (
                                    <TextInput
                                        label="Requested Time"
                                        source="$staged.activation.requested_time"
                                        {...rest}
                                    />
                                );
                            case 'activate_scheduled_absolute':
                                SetRedirectToActive(false);
                                return (
                                    <TextInput
                                        label="Requested Time"
                                        source="$staged.activation.requested_time"
                                        {...rest}
                                    />
                                );
                            default:
                                SetRedirectToActive(true);
                                set(
                                    formData,
                                    '$staged.activation.requested_time',
                                    null
                                );
                                return null;
                        }
                    }}
                </FormDataConsumer>

                <ChannelMappingMatrix is_show={false} />
            </SimpleForm>
        </Edit>
    );
};

export default DevicesEdit;
