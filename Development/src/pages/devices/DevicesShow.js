import React, { Fragment, useEffect, useState } from 'react';
import {
    ArrayField,
    BooleanField,
    Datagrid,
    FunctionField,
    Loading,
    ReferenceArrayField,
    ReferenceField,
    ReferenceManyField,
    ShowContextProvider,
    ShowView,
    SimpleShowLayout,
    SingleFieldList,
    TextField,
    Title,
    Toolbar,
    useRecordContext,
    useShowController,
} from 'react-admin';
import {
    Button,
    Card,
    CardContent,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    Typography,
} from '@material-ui/core';
import { Link, Route, Switch } from 'react-router-dom';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import { useTheme } from '@material-ui/styles';
import ImageEye from '@material-ui/icons/RemoveRedEye';
import ChipConditionalLabel from '../../components/ChipConditionalLabel';
import MapObject from '../../components/ObjectField';
import ResourceTitle from '../../components/ResourceTitle';
import TAIField from '../../components/TAIField';
import UrlField from '../../components/URLField';
import { queryVersion } from '../../settings';
import MappingShowActions from '../../components/MappingShowActions';
import DeleteButton from '../../components/DeleteButton';
import BackButton from '../../components/BackButton';
import ChannelMappingMatrix from './Matrix';
import MappingButton from '../../components/MappingButton';

export const DevicesShow = props => {
    const controllerProps = useShowController(props);
    return (
        <ShowContextProvider value={controllerProps}>
            <DevicesShowView {...props} />
        </ShowContextProvider>
    );
};

const DevicesShowView = props => {
    const { record } = useRecordContext();
    const [useIS08API, setUseIS08API] = useState(false);
    const is_activation_location = () => {
        if (props.location.pathname.includes('/Staged_Matrix/')) {
            let activation_id = props.location.pathname.split(
                '/Staged_Matrix/'
            )[1];
            if (has(record.$activations, activation_id)) {
                return true;
            }
        }
        return false;
    };
    useEffect(() => {
        if (get(record, '$channelMappingAPI') !== undefined) {
            setUseIS08API(true);
        } else {
            setUseIS08API(false);
        }
    }, [record]);

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
                        value={
                            is_activation_location()
                                ? `${props.basePath}/${props.id}/show/Staged_Matrix`
                                : props.location.pathname
                        }
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab
                            label="Summary"
                            value={`${props.match.url}`}
                            component={Link}
                            to={`${props.basePath}/${props.id}/show/`}
                        />
                        {['Active_Matrix', 'Staged_Matrix'].map(label => (
                            <Tab
                                key={label}
                                value={`${props.match.url}/${label}`}
                                component={Link}
                                to={`${props.basePath}/${props.id}/show/${label}`}
                                disabled={!get(record, '$io') || !useIS08API}
                                label={label.replace('_', ' ')}
                            />
                        ))}
                    </Tabs>
                </Paper>
                <span style={{ flexGrow: 1 }} />
                <MappingShowActions {...props} />
            </div>
            <Route exact path={`${props.basePath}/${props.id}/show/`}>
                <ShowSummaryTab record={record} {...props} />
            </Route>
            <Route
                exact
                path={`${props.basePath}/${props.id}/show/Active_Matrix`}
            >
                <ShowActiveMatrixTab deviceData={record} {...props} />
            </Route>
            <Route
                exact
                path={`${props.basePath}/${props.id}/show/Staged_Matrix`}
            >
                <ShowStagedMatrixTab deviceData={record} {...props} />
            </Route>
            {props.location.pathname.includes('/Staged_Matrix/') &&
                has(
                    record.$activations,
                    props.location.pathname.split('/Staged_Matrix/')[1]
                ) && (
                    <Route exact path={props.location.pathname}>
                        <ShowActivation record={record} {...props} />
                    </Route>
                )}
            {/* <Route
                exact
                path={`${props.basePath}/${props.id}/show/Staged_Matrix/i`}
                render={() => <ShowActivation record={record} />}
            ></Route> */}
        </>
    );
};

const ShowSummaryTab = ({ record, ...props }) => {
    return (
        <ShowView {...props} title={<ResourceTitle />} actions={<Fragment />}>
            <SimpleShowLayout>
                <TextField label="ID" source="id" />
                <TAIField source="version" />
                <TextField source="label" />
                {queryVersion() >= 'v1.1' && <TextField source="description" />}
                {queryVersion() >= 'v1.1' && (
                    <FunctionField
                        label="Tags"
                        render={record =>
                            Object.keys(record.tags).length > 0
                                ? MapObject(record, 'tags')
                                : null
                        }
                    />
                )}
                <hr />
                <TextField source="type" />
                {queryVersion() >= 'v1.1' && (
                    <ArrayField source="controls">
                        <Datagrid>
                            <UrlField source="href" label="Address" />
                            <TextField source="type" />
                            {queryVersion() >= 'v1.3' && (
                                <BooleanField source="authorization" />
                            )}
                        </Datagrid>
                    </ArrayField>
                )}
                <ReferenceField
                    label="Node"
                    source="node_id"
                    reference="nodes"
                    link="show"
                >
                    <ChipConditionalLabel source="label" />
                </ReferenceField>
                <ReferenceArrayField source="receivers" reference="receivers">
                    <SingleFieldList linkType="show">
                        <ChipConditionalLabel source="label" />
                    </SingleFieldList>
                </ReferenceArrayField>
                <ReferenceArrayField source="senders" reference="senders">
                    <SingleFieldList linkType="show">
                        <ChipConditionalLabel source="label" />
                    </SingleFieldList>
                </ReferenceArrayField>
                <ReferenceManyField
                    label="Sources"
                    reference="sources"
                    target="device_id"
                >
                    <SingleFieldList linkType="show">
                        <ChipConditionalLabel source="label" />
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField
                    label="Flows"
                    reference="flows"
                    target="device_id"
                >
                    <SingleFieldList linkType="show">
                        <ChipConditionalLabel source="label" />
                    </SingleFieldList>
                </ReferenceManyField>
            </SimpleShowLayout>
        </ShowView>
    );
};

const ShowActiveMatrixTab = ({ deviceData, ...props }) => {
    if (!get(deviceData, `$active.map`)) return <Loading />;
    return (
        <ShowView {...props} title={<ResourceTitle />} actions={<Fragment />}>
            <Card>
                <Title title={' Active Matrix'} />
                <CardContent>
                    <ChannelMappingMatrix
                        record={deviceData}
                        is_show={true}
                        mapping={get(deviceData, `$active.map`)}
                    />
                </CardContent>
            </Card>
        </ShowView>
    );
};

const ShowStagedMatrixTab = ({ deviceData, ...props }) => {
    if (!deviceData.$activations) return <Loading />;
    return (
        <>
            <ShowView
                {...props}
                title={<ResourceTitle />}
                actions={<Fragment />}
            >
                <Card>
                    <Title title={'Schedule Activations'} />
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        style={{
                                            paddingLeft: '32px',
                                        }}
                                    >
                                        Activation ID
                                    </TableCell>
                                    <TableCell>Mode</TableCell>
                                    <TableCell>Requested Time</TableCell>
                                    <TableCell>Activation Time</TableCell>
                                    <TableCell>Outputs</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(deviceData.$activations).map(
                                    ([activation_id, item]) => (
                                        <TableRow key={activation_id}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                <Button
                                                    style={{
                                                        textTransform: 'none',
                                                    }}
                                                    size="small"
                                                    label={activation_id}
                                                    component={Link}
                                                    to={`${props.basePath}/${props.id}/show/Staged_Matrix/${activation_id}`}
                                                    value={`${props.match.url}/Staged_Matrix`}
                                                    startIcon={<ImageEye />}
                                                >
                                                    {activation_id}
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                {item.activation.mode}
                                            </TableCell>
                                            <TableCell>
                                                <TAIField
                                                    record={item.activation}
                                                    source={'requested_time'}
                                                    mode={'mode'}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TAIField
                                                    record={item.activation}
                                                    source={'activation_time'}
                                                    mode={'mode'}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <>
                                                    {Object.keys(
                                                        item.action
                                                    ).map(output_nmos_name => (
                                                        <Typography variant="body2">
                                                            {get(
                                                                deviceData.$io
                                                                    .outputs,
                                                                `${output_nmos_name}.properties.name`
                                                            )}
                                                        </Typography>
                                                    ))}
                                                </>
                                            </TableCell>
                                            <TableCell>
                                                <DeleteButton
                                                    resource="devices"
                                                    id={activation_id}
                                                    variant="text"
                                                    record={deviceData}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </ShowView>
            <Switch>
                <Route
                    path={`${props.basePath}/${props.id}/show/Staged_Matrix/i`}
                    render={() => (
                        <ShowActivation record={deviceData.$activations} />
                    )}
                ></Route>
            </Switch>
        </>
    );
};

const InputChannelMappingRow = ({
    input_channel_array,
    input_nmos_name,
    record,
    activation,
}) => {
    return input_channel_array.map(channel => (
        <TableRow>
            <TableCell>
                {
                    get(record, `$io.inputs.${input_nmos_name}.channels`)[
                        channel
                    ].label
                }
            </TableCell>
            {Object.entries(activation.action).map(
                ([output_nmos_name, output_item]) =>
                    Object.entries(output_item).map(
                        ([channel_index, channel_item]) => (
                            <TableCell align="center">
                                <MappingButton
                                    disabeld={true}
                                    ischecked={
                                        input_nmos_name ===
                                            channel_item.input &&
                                        channel_item.channel_index === channel
                                    }
                                />
                            </TableCell>
                        )
                    )
            )}
        </TableRow>
    ));
};

const ShowActivation = ({ record, ...props }) => {
    const activation_id = props.location.pathname.split('/Staged_Matrix/')[1];
    const activation = get(record, `$activations.${activation_id}`);
    set(record, `$activations.${activation_id}.id`, activation_id);
    const inputs = {};
    for (const output of Object.values(activation.action)) {
        for (const input of Object.values(output)) {
            if (has(inputs, `${input.input}`)) {
                let channel_array = get(inputs, `${input.input}`);
                if (!channel_array.includes(input.channel_index)) {
                    channel_array.push(input.channel_index);
                    set(inputs, `${input.input}`, channel_array);
                }
            } else {
                set(inputs, `${input.input}`, [input.channel_index]);
            }
        }
    }
    return (
        <>
            <ShowView
                {...props}
                title={<ResourceTitle />}
                actions={<Fragment />}
            >
                <SimpleShowLayout>
                    <TextField
                        label="ID"
                        source={`$activations.${activation_id}.id`}
                    />
                    <TextField
                        label="Mode"
                        source={`$activations.${activation_id}.activation.mode`}
                    />
                    <TAIField
                        label="Requested Time"
                        source={`$activations.${activation_id}.activation.requested_time`}
                        mode={'mode'}
                    />
                    <TAIField
                        label="Activation Time"
                        source={`$activations.${activation_id}.activation.activation_time`}
                        mode={'mode'}
                    />
                    <Table border={1}>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    style={{ color: '#76b900' }}
                                    size="small"
                                    align="center"
                                    rowSpan={2}
                                    colSpan={2}
                                >
                                    {'INPUTS \\ OUTPUTS'}
                                </TableCell>
                                {Object.entries(activation.action).map(
                                    ([output_nmos_name, output_item]) => (
                                        <TableCell
                                            align="center"
                                            colSpan={
                                                Object.keys(output_item).length
                                            }
                                        >
                                            {get(
                                                record,
                                                `$io.outputs.${output_nmos_name}.properties.name`
                                            )}
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                            <TableRow>
                                {Object.entries(activation.action).map(
                                    ([output_nmos_name, output_item]) =>
                                        Object.entries(output_item).map(
                                            ([channel_index, channel_item]) => (
                                                <TableCell
                                                    align="center"
                                                    size="small"
                                                    style={{
                                                        color: '#76b900',
                                                    }}
                                                >
                                                    {
                                                        get(
                                                            record,
                                                            `$io.outputs.${output_nmos_name}.channels`
                                                        )[channel_index].label
                                                    }
                                                </TableCell>
                                            )
                                        )
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(inputs).map(
                                ([input_nmos_name, input_channel_array]) => (
                                    <>
                                        <TableRow>
                                            <TableCell
                                                rowSpan={
                                                    input_channel_array.length +
                                                    1
                                                }
                                            >
                                                {get(
                                                    record,
                                                    `$io.inputs.${input_nmos_name}.properties.name`
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <InputChannelMappingRow
                                            input_channel_array={
                                                input_channel_array
                                            }
                                            input_nmos_name={input_nmos_name}
                                            record={record}
                                            activation={activation}
                                        />
                                    </>
                                )
                            )}
                        </TableBody>
                    </Table>
                </SimpleShowLayout>
            </ShowView>
            <Toolbar
                resource="devices"
                record={record}
                style={{ marginTop: 0 }}
            >
                <DeleteButton
                    resource="devices"
                    id={activation_id}
                    variant="text"
                    record={record}
                />
                <BackButton
                    resource="devices"
                    id={props.id}
                    variant="text"
                    record={record}
                />
            </Toolbar>
        </>
    );
};

export default DevicesShow;
