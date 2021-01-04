import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@material-ui/core';
import {
    ReferenceField,
    ReferenceManyField,
    SingleFieldList,
} from 'react-admin';
import get from 'lodash/get';
import ChipConditionalLabel from '../../components/ChipConditionalLabel';
import MappingButton from '../../components/MappingButton';
import CollapseButton from '../../components/CollapseButton';

const get_output_routable_input = (output_item, io) => {
    return output_item.caps.routable_inputs !== null
        ? output_item.caps.routable_inputs
              .map(input_nmos_name => {
                  return input_nmos_name === null
                      ? 'null'
                      : get(io.inputs, `${input_nmos_name}.properties.name`);
              })
              .join(', ')
        : 'null';
};

const get_output_caps = (output_item, io) => {
    return (
        <>
            <Typography variant="body2">{'description: '}</Typography>
            {output_item.properties.description}
            <Typography variant="body2">{'routable inputs:'}</Typography>
            {get_output_routable_input(output_item, io)}
        </>
    );
};

const get_input_caps = input_item => {
    return (
        <>
            <Typography variant="body2">
                {'description: '.concat(input_item.properties.description)}
            </Typography>
            {Object.entries(input_item.caps).map(([cap_key, cap_value]) => (
                <Typography variant="body2">
                    {[cap_key, cap_value].join(': ')}
                </Typography>
            ))}
        </>
    );
};

const get_source_tooltip = output_item => {
    return (
        <>
            <Typography variant="body2">{'Flows:'} </Typography>
            <div>
                <hr />
                <ReferenceManyField
                    record={output_item}
                    basePath="/flows"
                    label="Flows"
                    source="source_id"
                    reference="flows"
                    target="source_id"
                    link="show"
                >
                    <div
                        style={{
                            margin: 5,
                            padding: 10,
                        }}
                    >
                        <SingleFieldList linkType="show">
                            <ChipConditionalLabel source="label" />
                        </SingleFieldList>
                    </div>
                </ReferenceManyField>
            </div>
            <Typography variant="body2">{'Senders:'} </Typography>
            <div>
                <hr />
                <ReferenceManyField
                    record={output_item}
                    basePath="/flows"
                    label="Flows"
                    source="source_id"
                    reference="flows"
                    target="source_id"
                >
                    <SingleFieldList>
                        <ReferenceManyField
                            label="Senders"
                            basePath="/senders"
                            source="id"
                            target="flow_id"
                            reference="senders"
                            link="show"
                        >
                            <div
                                style={{
                                    margin: 5,
                                    padding: 10,
                                }}
                            >
                                <SingleFieldList linkType="show">
                                    <ChipConditionalLabel source="label" />
                                </SingleFieldList>
                            </div>
                        </ReferenceManyField>
                    </SingleFieldList>
                </ReferenceManyField>
            </div>
        </>
    );
};

const OutputSourceAssociation = ({ outputs, isExpend }) =>
    Object.entries(outputs).map(([output_nmos_name, output_item]) => (
        <TableCell
            align="center"
            colSpan={
                isExpend(output_nmos_name) ? output_item.channels.length : 1
            }
        >
            {output_item.source_id ? (
                <Tooltip
                    interactive
                    title={get_source_tooltip(output_item)}
                    placement="bottom"
                    link
                    style={{
                        maxmWidth: {
                            maxWidth: 700,
                        },
                    }}
                >
                    <div>
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
                    </div>
                </Tooltip>
            ) : null}
        </TableCell>
    ));

const InputSourceAssociation = ({ isRowExpanded, input_item }) => (
    <TableCell
        align="center"
        rowSpan={isRowExpanded ? input_item.channels.length + 1 : 1}
    >
        {input_item.parent.type === 'source' ? (
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
        ) : input_item.parent.type === 'receiver' ? (
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
);

const OutputChannelCell = ({ isExpend, output_item }) => {
    return isExpend
        ? output_item.channels.map(channel => (
              <TableCell
                  align="center"
                  size="small"
                  style={{
                      color: '#76b900',
                  }}
              >
                  {channel.label}
              </TableCell>
          ))
        : null;
};

const FillEmptyCellsForCollapseRow = ({
    isRowExpanded,
    outputs,
    isColExpanded,
}) =>
    isRowExpanded
        ? null
        : Object.entries(outputs).map(([output_nmos_name, output_item]) => {
              return isColExpanded(output_nmos_name) ? (
                  output_item.channels.map(() => (
                      <TableCell align="right">{''}</TableCell>
                  ))
              ) : (
                  <TableCell align="right">{''}</TableCell>
              );
          });

const InputChannelMappingRow = ({
    input_item,
    input_nmos_name,
    outputs,
    isColExpanded,
    mapping_disabeld,
    handleMap,
    ischecked,
}) => {
    return Object.entries(input_item.channels).map(([input_index, channel]) => (
        <TableRow>
            <TableCell size="small" style={{ color: '#76b900' }}>
                {channel.label}
            </TableCell>
            <>
                {Object.entries(outputs).map(
                    ([output_nmos_name, output_item]) => {
                        return isColExpanded(output_nmos_name) ? (
                            output_item.channels.map(
                                (output_channel, index) => {
                                    return (
                                        <TableCell
                                            align="center"
                                            style={{
                                                color: '#76b900',
                                            }}
                                        >
                                            <MappingButton
                                                tooltip_title={
                                                    <>
                                                        <Typography variant="body2">
                                                            {'Input Channel: '}
                                                        </Typography>
                                                        {channel.label}
                                                        <Typography variant="body2">
                                                            {'Output Channel: '}
                                                        </Typography>
                                                        {output_channel.label}
                                                    </>
                                                }
                                                disabeld={mapping_disabeld}
                                                onClick={() =>
                                                    handleMap(
                                                        input_nmos_name,
                                                        output_nmos_name,
                                                        input_index,
                                                        index
                                                    )
                                                }
                                                ischecked={ischecked(
                                                    input_nmos_name,
                                                    output_nmos_name,
                                                    input_index,
                                                    index
                                                )}
                                            />
                                        </TableCell>
                                    );
                                }
                            )
                        ) : (
                            <TableCell align="right">{''}</TableCell>
                        );
                    }
                )}
            </>
        </TableRow>
    ));
};

const MuteMappingRow = ({
    outputs,
    mapping_disabeld,
    handleMap,
    ischecked,
    isColExpanded,
}) => {
    return Object.entries(outputs).map(([output_nmos_name, output_item]) => {
        return isColExpanded(output_nmos_name) ? (
            output_item.channels.map((channel, index) => (
                <TableCell align="center" style={{ color: '#76b900' }}>
                    <MappingButton
                        tooltip_title={
                            <>
                                <Typography variant="body2">
                                    {'Input Channel: '}
                                </Typography>
                                {'MUTE'}
                                <Typography variant="body2">
                                    {'Output Channel: '}
                                </Typography>
                                {channel.label}
                            </>
                        }
                        disabeld={mapping_disabeld}
                        onClick={() =>
                            handleMap(null, output_nmos_name, null, index)
                        }
                        ischecked={ischecked(
                            null,
                            output_nmos_name,
                            null,
                            index
                        )}
                    />
                </TableCell>
            ))
        ) : (
            <TableCell align="right">{''}</TableCell>
        );
    });
};

const ChannelMappingMatrix = ({ record, is_show, mapping, handleMap }) => {
    const [expandedCols, setExpandedCols] = React.useState([]);
    const [expandedRows, setExpandedRows] = React.useState([]);
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
    const isRowExpanded = input_real_name => {
        return expandedRows.includes(input_real_name);
    };
    const isColExpanded = output_real_name => {
        return expandedCols.includes(output_real_name);
    };
    const ischecked = (
        input_real_name,
        output_real_name,
        input_channel,
        output_channel
    ) => {
        const map_to_input = get(
            mapping,
            `${output_real_name}.${output_channel}.input`
        );
        const map_to_input_channel = get(
            mapping,
            `${output_real_name}.${output_channel}.channel_index`
        );
        return (
            map_to_input === input_real_name &&
            String(map_to_input_channel) === String(input_channel)
        );
    };
    const io = get(record, '$io');
    return (
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
                    <OutputSourceAssociation
                        outputs={get(io, `outputs`)}
                        expandedCols={expandedCols}
                        isExpend={output => isColExpanded(output)}
                    />
                </TableRow>
                <TableRow>
                    {Object.entries(io.outputs).map(
                        ([output_nmos_name, output_item]) => (
                            <TableCell
                                style={{ color: '#76b900' }}
                                size="small"
                                align="center"
                                colSpan={
                                    isColExpanded(output_nmos_name)
                                        ? output_item.channels.length
                                        : 1
                                }
                                rowSpan={
                                    isColExpanded(output_nmos_name) ? 1 : 2
                                }
                            >
                                <CollapseButton
                                    title={
                                        isColExpanded(output_nmos_name)
                                            ? "Hide output's channels"
                                            : "View output's channels"
                                    }
                                    onClick={() =>
                                        handleEpandCol(output_nmos_name)
                                    }
                                    isExpend={isColExpanded(output_nmos_name)}
                                />
                                <Tooltip
                                    title={get_output_caps(output_item, io)}
                                    placement="bottom"
                                >
                                    <div>{output_item.properties.name}</div>
                                </Tooltip>
                            </TableCell>
                        )
                    )}
                </TableRow>
                <TableRow>
                    {Object.entries(io.outputs).map(
                        ([output_nmos_name, output_item]) => (
                            <OutputChannelCell
                                isExpend={isColExpanded(output_nmos_name)}
                                output_item={output_item}
                            />
                        )
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
                    <MuteMappingRow
                        outputs={get(io, `outputs`)}
                        mapping_disabeld={is_show}
                        handleMap={handleMap}
                        ischecked={ischecked}
                        isColExpanded={output => isColExpanded(output)}
                    />
                </TableRow>
                {Object.entries(io.inputs).map(
                    ([input_nmos_name, input_item]) => (
                        <>
                            <TableRow>
                                <InputSourceAssociation
                                    isRowExpanded={isRowExpanded(
                                        input_nmos_name
                                    )}
                                    input_item={input_item}
                                />
                                <TableCell
                                    style={{ color: '#76b900' }}
                                    size="small"
                                    rowSpan={
                                        isRowExpanded(input_nmos_name)
                                            ? input_item.channels.length + 1
                                            : 1
                                    }
                                    colSpan={
                                        isRowExpanded(input_nmos_name) ? 1 : 2
                                    }
                                >
                                    <CollapseButton
                                        title={
                                            isRowExpanded(input_nmos_name)
                                                ? "Hide input's channels"
                                                : "View input's channels"
                                        }
                                        onClick={() =>
                                            handleEpandRow(input_nmos_name)
                                        }
                                        isExpend={isRowExpanded(
                                            input_nmos_name
                                        )}
                                    />
                                    <Tooltip
                                        title={get_input_caps(input_item)}
                                        placement="bottom"
                                    >
                                        <div>{input_item.properties.name}</div>
                                    </Tooltip>
                                </TableCell>
                                <FillEmptyCellsForCollapseRow
                                    isRowExpanded={isRowExpanded(
                                        input_nmos_name
                                    )}
                                    outputs={get(io, `outputs`)}
                                    isColExpanded={output =>
                                        isColExpanded(output)
                                    }
                                />
                            </TableRow>
                            {isRowExpanded(input_nmos_name) ? (
                                <InputChannelMappingRow
                                    input_item={input_item}
                                    input_nmos_name={input_nmos_name}
                                    outputs={get(io, `outputs`)}
                                    isColExpanded={output =>
                                        isColExpanded(output)
                                    }
                                    mapping_disabeld={is_show}
                                    handleMap={handleMap}
                                    ischecked={ischecked}
                                />
                            ) : null}
                        </>
                    )
                )}
            </TableBody>
        </Table>
    );
};

export default ChannelMappingMatrix;
