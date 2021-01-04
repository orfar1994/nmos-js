import React, { Fragment } from 'react';
import { Link, Route } from 'react-router-dom';
import { Paper, Tab, Tabs } from '@material-ui/core';
import {
    Edit,
    FormDataConsumer,
    Loading,
    SelectInput,
    SimpleForm,
    TextInput,
    useNotify,
} from 'react-admin';
import { useFormState } from 'react-final-form';
import get from 'lodash/get';
import set from 'lodash/set';
import ClearIcon from '@material-ui/icons/Clear';
import { useTheme } from '@material-ui/styles';
import MappingEditActions from '../../components/MappingEditActions';
import MappingEditToolbar from '../../components/MappingEditToolbar';
import ChannelMappingMatrix from './Matrix';

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

const EditChannelMappingMatrix = ({ record }) => {
    const active = get(record, '$active');
    const formState = useFormState().values;
    const notify = useNotify();
    const [click_box_1, setclickbox_1] = React.useState(
        JSON.parse(JSON.stringify(active.map))
    );
    set(formState, `$staged.active`, click_box_1);
    if (!record.$active.map) return <Loading />;

    const handleMap = (
        input_real_name,
        output_real_name,
        input_channel,
        output_channel
    ) => {
        const map_to_input = get(
            click_box_1,
            `${output_real_name}.${output_channel}.input`
        );
        const map_to_input_channel = get(
            click_box_1,
            `${output_real_name}.${output_channel}.channel_index`
        );
        const currentclick_box_1 = JSON.parse(JSON.stringify(click_box_1));
        if (
            map_to_input === input_real_name &&
            String(map_to_input_channel) === String(input_channel)
        ) {
            input_real_name = null;
            input_channel = null;
        }
        const output_routable_inputs = get(
            record,
            `$io.outputs.${output_real_name}.caps.routable_inputs`
        );
        if (
            output_routable_inputs !== null &&
            !output_routable_inputs.includes(input_real_name)
        ) {
            notify(
                `Bad Request; output '${output_real_name}' cannot be routed from input '${input_real_name}'`,
                'warning'
            );
            return;
        }
        set(
            currentclick_box_1,
            `${output_real_name}.${output_channel}.input`,
            input_real_name
        );
        set(
            currentclick_box_1,
            `${output_real_name}.${output_channel}.channel_index`,
            input_channel
        );
        setclickbox_1(currentclick_box_1);
    };
    return (
        <ChannelMappingMatrix
            record={record}
            is_show={false}
            mapping={click_box_1}
            handleMap={handleMap}
        />
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

                <EditChannelMappingMatrix />
            </SimpleForm>
        </Edit>
    );
};

export default DevicesEdit;
