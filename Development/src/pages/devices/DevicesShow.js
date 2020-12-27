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
    ShowButton,
    ShowContextProvider,
    ShowView,
    SimpleShowLayout,
    SingleFieldList,
    TextField,
    Title,
    useRecordContext,
    useShowController,
} from 'react-admin';
import {
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
} from '@material-ui/core';
import { Link, Route } from 'react-router-dom';
import get from 'lodash/get';
import { useTheme } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import Tooltip from '@material-ui/core/Tooltip';
import ChipConditionalLabel from '../../components/ChipConditionalLabel';
import MapObject from '../../components/ObjectField';
import ResourceTitle from '../../components/ResourceTitle';
import TAIField from '../../components/TAIField';
import UrlField from '../../components/URLField';
import { queryVersion } from '../../settings';
import MappingShowActions from '../../components/MappingShowActions';
import DeleteButton from '../../components/DeleteButton';

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
                        value={props.location.pathname}
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
    const [expandedCols, setExpandedCols] = React.useState([]);
    const [expandedRows, setExpandedRows] = React.useState([]);

    if (!deviceData.$active.map) return <Loading />;

    const handleEpandRow = input_real_name => {
        const currentExpandedRows = expandedRows;
        const isRowExpanded = currentExpandedRows.includes(input_real_name);
        const newExpandedRows = isRowExpanded
            ? currentExpandedRows.filter(name => name !== input_real_name)
            : currentExpandedRows.concat(input_real_name);

        setExpandedRows(newExpandedRows);
    };
    const handleEpandCol = output_real_name => {
        const currentExpandedCols = expandedCols;
        const isColExpanded = currentExpandedCols.includes(output_real_name);
        const newExpandedCols = isColExpanded
            ? currentExpandedCols.filter(name => name !== output_real_name)
            : currentExpandedCols.concat(output_real_name);

        setExpandedCols(newExpandedCols);
    };

    const ischecked = (
        input_real_name,
        output_real_name,
        input_channel,
        output_channel
    ) => {
        const map_to_input = get(
            deviceData.$active.map,
            `${output_real_name}.${output_channel}.input`
        );
        const map_to_input_channel = get(
            deviceData.$active.map,
            `${output_real_name}.${output_channel}.channel_index`
        );
        return (
            map_to_input === input_real_name &&
            String(map_to_input_channel) === String(input_channel)
        );
    };
    return (
        <ShowView {...props} title={<ResourceTitle />} actions={<Fragment />}>
            <Card>
                <Title title={' Active Matrix'} />
                <CardContent>
                    <Table border={1}>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    style={{ color: '#76b900' }}
                                    size="small"
                                    align="center"
                                    rowSpan={3}
                                    colSpan={3}
                                >
                                    {'INPUTS \\ OUTPUTS'}
                                </TableCell>
                                {Object.entries(deviceData.$io.outputs).map(
                                    ([output_nmos_name, output_item]) => (
                                        <TableCell
                                            align="center"
                                            colSpan={
                                                expandedCols.includes(
                                                    output_nmos_name
                                                )
                                                    ? output_item.channels
                                                          .length
                                                    : 1
                                            }
                                        >
                                            {output_item.source_id ? (
                                                <ReferenceField
                                                    record={output_item}
                                                    basePath="/sources"
                                                    label="Sources"
                                                    source="source_id"
                                                    reference="sources"
                                                    link="show"
                                                >
                                                    <ChipConditionalLabel source="label" />
                                                </ReferenceField>
                                            ) : null}
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                            <TableRow>
                                {Object.entries(deviceData.$io.outputs).map(
                                    ([output_nmos_name, output_item]) => (
                                        <TableCell
                                            style={{ color: '#76b900' }}
                                            size="small"
                                            align="center"
                                            colSpan={
                                                expandedCols.includes(
                                                    output_nmos_name
                                                )
                                                    ? output_item.channels
                                                          .length
                                                    : 1
                                            }
                                            rowSpan={
                                                expandedCols.includes(
                                                    output_nmos_name
                                                )
                                                    ? 1
                                                    : 2
                                            }
                                        >
                                            <IconButton
                                                aria-label="expand col"
                                                size="small"
                                                title={
                                                    expandedCols.includes(
                                                        output_nmos_name
                                                    )
                                                        ? "Hide output's channels"
                                                        : "View output's channels"
                                                }
                                                onClick={() =>
                                                    handleEpandCol(
                                                        output_nmos_name
                                                    )
                                                }
                                            >
                                                {expandedCols.includes(
                                                    output_nmos_name
                                                ) ? (
                                                    <KeyboardArrowUpIcon />
                                                ) : (
                                                    <KeyboardArrowDownIcon />
                                                )}
                                            </IconButton>
                                            {output_item.properties.name}
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                            <TableRow>
                                {Object.entries(deviceData.$io.outputs).map(
                                    ([output_nmos_name, output_item]) => {
                                        return expandedCols.includes(
                                            output_nmos_name
                                        )
                                            ? output_item.channels.map(
                                                  channel => (
                                                      <TableCell
                                                          align="center"
                                                          size="small"
                                                          style={{
                                                              color: '#76b900',
                                                          }}
                                                      >
                                                          {channel.label}
                                                      </TableCell>
                                                  )
                                              )
                                            : null;
                                    }
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    align="center"
                                    colSpan={3}
                                    style={{ color: '#76b900' }}
                                >
                                    {'MUTE'}
                                </TableCell>
                                {Object.entries(deviceData.$io.outputs).map(
                                    ([output_nmos_name, output_item]) => {
                                        return expandedCols.includes(
                                            output_nmos_name
                                        ) ? (
                                            output_item.channels.map(
                                                (channel, index) => (
                                                    <TableCell
                                                        align="center"
                                                        style={{
                                                            color: '#76b900',
                                                        }}
                                                    >
                                                        <Tooltip
                                                            title={[
                                                                channel.label,
                                                                'MUTE',
                                                            ].join(' ')}
                                                            placement="bottom"
                                                        >
                                                            <div>
                                                                <IconButton
                                                                    disabled
                                                                >
                                                                    {ischecked(
                                                                        null,
                                                                        output_nmos_name,
                                                                        null,
                                                                        index
                                                                    ) ? (
                                                                        <CheckCircleOutlineIcon />
                                                                    ) : (
                                                                        <RadioButtonUncheckedIcon />
                                                                    )}
                                                                </IconButton>
                                                            </div>
                                                        </Tooltip>
                                                        {/* <Radio
                                                    checked={ischecked(null,output_nmos_name,null,index)}
                                                    onChange={event => handleChange(event)}
                                                    name={"radio-button-demo"}
                                                    color= '#76b900'
                                                    /> */}
                                                    </TableCell>
                                                )
                                            )
                                        ) : (
                                            <TableCell align="right">
                                                {''}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                            {Object.entries(deviceData.$io.inputs).map(
                                ([input_nmos_name, input_item]) => (
                                    <>
                                        <TableRow>
                                            <TableCell
                                                align="center"
                                                rowSpan={
                                                    expandedRows.includes(
                                                        input_nmos_name
                                                    )
                                                        ? input_item.channels
                                                              .length + 1
                                                        : 1
                                                }
                                            >
                                                {input_item.parent.type ===
                                                'source' ? (
                                                    <ReferenceField
                                                        record={input_item}
                                                        basePath="/sources"
                                                        label="Sources"
                                                        source="parent.id"
                                                        reference="sources"
                                                        link="show"
                                                    >
                                                        <ChipConditionalLabel source="label" />
                                                    </ReferenceField>
                                                ) : input_item.parent.type ===
                                                  'receiver' ? (
                                                    <ReferenceField
                                                        record={input_item}
                                                        basePath="/receivers"
                                                        label="Receivers"
                                                        source="parent.id"
                                                        reference="receivers"
                                                        link="show"
                                                    >
                                                        <ChipConditionalLabel source="label" />
                                                    </ReferenceField>
                                                ) : null}
                                            </TableCell>
                                            <TableCell
                                                style={{ color: '#76b900' }}
                                                size="small"
                                                rowSpan={
                                                    expandedRows.includes(
                                                        input_nmos_name
                                                    )
                                                        ? input_item.channels
                                                              .length + 1
                                                        : 1
                                                }
                                                colSpan={
                                                    expandedRows.includes(
                                                        input_nmos_name
                                                    )
                                                        ? 1
                                                        : 2
                                                }
                                            >
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    title={
                                                        expandedRows.includes(
                                                            input_nmos_name
                                                        )
                                                            ? "Hide input's channels"
                                                            : "View input's channels"
                                                    }
                                                    onClick={() =>
                                                        handleEpandRow(
                                                            input_nmos_name
                                                        )
                                                    }
                                                >
                                                    {expandedRows.includes(
                                                        input_nmos_name
                                                    ) ? (
                                                        <KeyboardArrowUpIcon />
                                                    ) : (
                                                        <KeyboardArrowDownIcon />
                                                    )}
                                                </IconButton>
                                                {input_item.properties.name}
                                            </TableCell>
                                            {expandedRows.includes(
                                                input_nmos_name
                                            )
                                                ? null
                                                : Object.entries(
                                                      deviceData.$io.outputs
                                                  ).map(
                                                      ([
                                                          output_nmos_name,
                                                          output_item,
                                                      ]) => {
                                                          return expandedCols.includes(
                                                              output_nmos_name
                                                          ) ? (
                                                              output_item.channels.map(
                                                                  () => (
                                                                      <TableCell align="right">
                                                                          {''}
                                                                      </TableCell>
                                                                  )
                                                              )
                                                          ) : (
                                                              <TableCell align="right">
                                                                  {''}
                                                              </TableCell>
                                                          );
                                                      }
                                                  )}
                                        </TableRow>
                                        {expandedRows.includes(input_nmos_name)
                                            ? Object.entries(
                                                  input_item.channels
                                              ).map(
                                                  ([input_index, channel]) => (
                                                      <TableRow>
                                                          <TableCell
                                                              size="small"
                                                              style={{
                                                                  color:
                                                                      '#76b900',
                                                              }}
                                                          >
                                                              {channel.label}
                                                          </TableCell>
                                                          <>
                                                              {Object.entries(
                                                                  deviceData.$io
                                                                      .outputs
                                                              ).map(
                                                                  ([
                                                                      output_nmos_name,
                                                                      output_item,
                                                                  ]) => {
                                                                      return expandedCols.includes(
                                                                          output_nmos_name
                                                                      ) ? (
                                                                          output_item.channels.map(
                                                                              (
                                                                                  output_channel,
                                                                                  index
                                                                              ) => {
                                                                                  return (
                                                                                      <TableCell
                                                                                          align="center"
                                                                                          style={{
                                                                                              color:
                                                                                                  '#76b900',
                                                                                          }}
                                                                                      >
                                                                                          <Tooltip
                                                                                              title={[
                                                                                                  output_channel.label,
                                                                                                  channel.label,
                                                                                              ].join(
                                                                                                  ' '
                                                                                              )}
                                                                                              placement="bottom"
                                                                                          >
                                                                                              <div>
                                                                                                  <IconButton
                                                                                                      disabled={
                                                                                                          true
                                                                                                      }
                                                                                                      title={[
                                                                                                          output_channel.label,
                                                                                                          channel.label,
                                                                                                      ].join(
                                                                                                          ' '
                                                                                                      )}
                                                                                                  >
                                                                                                      {ischecked(
                                                                                                          input_nmos_name,
                                                                                                          output_nmos_name,
                                                                                                          input_index,
                                                                                                          index
                                                                                                      ) ? (
                                                                                                          <CheckCircleOutlineIcon></CheckCircleOutlineIcon>
                                                                                                      ) : (
                                                                                                          <RadioButtonUncheckedIcon></RadioButtonUncheckedIcon>
                                                                                                      )}
                                                                                                  </IconButton>
                                                                                              </div>
                                                                                          </Tooltip>
                                                                                          {/* <Radio
                                                                    checked={ischecked(input_nmos_name,output_nmos_name,input_index,index)}
                                                                    onChange={event => handleChange(event)}
                                                                    name="radio-button-demo"
                                                                    /> */}
                                                                                      </TableCell>
                                                                                  );
                                                                              }
                                                                          )
                                                                      ) : (
                                                                          <TableCell align="right">
                                                                              {
                                                                                  ''
                                                                              }
                                                                          </TableCell>
                                                                      );
                                                                  }
                                                              )}
                                                          </>
                                                      </TableRow>
                                                  )
                                              )
                                            : null}
                                    </>
                                )
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </ShowView>
    );
};

const ShowStagedMatrixTab = ({ deviceData, ...props }) => {
    if (!deviceData.$activations) return <Loading />;

    return (
        <ShowView {...props} title={<ResourceTitle />} actions={<Fragment />}>
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
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(deviceData.$activations).map(
                                ([activation_id, item]) => (
                                    <TableRow key={activation_id}>
                                        <TableCell component="th" scope="row">
                                            <ShowButton
                                                style={{
                                                    textTransform: 'none',
                                                }}
                                                basePath="/subscriptions"
                                                record={item}
                                                label={activation_id}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {item.activation.mode}
                                        </TableCell>
                                        <TableCell>
                                            {item.activation.requested_time}
                                        </TableCell>
                                        <TableCell>
                                            {item.activation.activation_time}
                                        </TableCell>
                                        <TableCell>
                                            <DeleteButton
                                                resource="subscriptions"
                                                id={item.id}
                                                variant="text"
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
    );
};

export default DevicesShow;
