import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
} from '@material-ui/core';
import { Loading, ReferenceField } from 'react-admin';
import { useFormState } from 'react-final-form';
import get from 'lodash/get';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import ChipConditionalLabel from '../../components/ChipConditionalLabel';
import { set } from 'lodash';

const ChannelMappingMatrix = ({ record, is_show }) => {
    const active = get(record, '$active');
    const io = get(record, '$io');
    const formState = useFormState().values;
    const [expandedCols, setExpandedCols] = React.useState([]);
    const [expandedRows, setExpandedRows] = React.useState([]);
    const [click_box_1, setclickbox_1] = React.useState(
        JSON.parse(JSON.stringify(active.map))
    );
    set(formState, `$staged.active`, click_box_1);

    if (!record.$active.map) return <Loading />;

    const handleEpandRow = (event, input_real_name) => {
        const currentExpandedRows = expandedRows;
        const isRowExpanded = currentExpandedRows.includes(input_real_name);

        let obj = {};
        isRowExpanded
            ? (obj[input_real_name] = false)
            : (obj[input_real_name] = true);

        // If the row is expanded, we are here to hide it. Hence remove
        // it from the state variable. Otherwise add to it.
        const newExpandedRows = isRowExpanded
            ? currentExpandedRows.filter(name => name !== input_real_name)
            : currentExpandedRows.concat(input_real_name);

        setExpandedRows(newExpandedRows);
    };
    const handleEpandCol = (event, output_real_name) => {
        const currentExpandedCols = expandedCols;
        const isColExpanded = currentExpandedCols.includes(output_real_name);

        let obj = {};
        isColExpanded
            ? (obj[output_real_name] = false)
            : (obj[output_real_name] = true);

        // If the row is expanded, we are here to hide it. Hence remove
        // it from the state variable. Otherwise add to it.
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
            click_box_1,
            `${output_real_name}.${output_channel}.input`
        );
        const map_to_input_channel = get(
            click_box_1,
            `${output_real_name}.${output_channel}.channel_index`
        );
        return (
            map_to_input === input_real_name &&
            String(map_to_input_channel) === String(input_channel)
        );
        // const staged = get(formState, '$staged');
        // const map_to_input = get(active.map,`${output_real_name}.${output_channel}.input`);
        // const map_to_input_channel = get(active.map,`${output_real_name}.${output_channel}.channel_index`);
        // const staged_map_to_input = get(staged,`action.${output_real_name}.${output_channel}.input`);
        // const staget_map_to_input_channel = get(staged,`action.${output_real_name}.${output_channel}.channel_index`);
        // if(staged_map_to_input !== undefined){
        //     return staged_map_to_input===input_real_name && String(staget_map_to_input_channel)===String(input_channel);
        // }else{
        //     return map_to_input===input_real_name && String(map_to_input_channel)===String(input_channel);
        // }
    };
    const handleMap = (
        event,
        input_real_name,
        output_real_name,
        input_channel,
        output_channel
    ) => {
        // const currentclick_box = click_box;
        // const box_key = [input_real_name, output_real_name, input_channel, output_channel].join("_");
        // const isboxchecked = currentclick_box.includes(box_key);
        //let new_click = [];
        // if(isboxchecked){
        //     new_click = currentclick_box.filter(key => key!==box_key);
        //     new_click.concat([null, output_real_name, null, output_channel].join("_"));
        // }else{
        //     new_click = currentclick_box.concat(box_key);
        // }
        //setclickbox(new_click);

        // validate routable inputs.
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
                    {Object.entries(io.outputs).map(
                        ([output_nmos_name, output_item]) => (
                            <TableCell
                                align="center"
                                colSpan={
                                    expandedCols.includes(output_nmos_name)
                                        ? output_item.channels.length
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
                    {Object.entries(io.outputs).map(
                        ([output_nmos_name, output_item]) => (
                            <TableCell
                                style={{ color: '#76b900' }}
                                size="small"
                                align="center"
                                colSpan={
                                    expandedCols.includes(output_nmos_name)
                                        ? output_item.channels.length
                                        : 1
                                }
                                rowSpan={
                                    expandedCols.includes(output_nmos_name)
                                        ? 1
                                        : 2
                                }
                            >
                                <IconButton
                                    aria-label="expand col"
                                    size="small"
                                    title={
                                        expandedCols.includes(output_nmos_name)
                                            ? "Hide output's channels"
                                            : "View output's channels"
                                    }
                                    onClick={event =>
                                        handleEpandCol(event, output_nmos_name)
                                    }
                                >
                                    {expandedCols.includes(output_nmos_name) ? (
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
                    {Object.entries(io.outputs).map(
                        ([output_nmos_name, output_item]) => {
                            return expandedCols.includes(output_nmos_name)
                                ? output_item.channels.map(channel => (
                                      <TableCell
                                          align="center"
                                          size="small"
                                          style={{ color: '#76b900' }}
                                      >
                                          {channel.label}
                                      </TableCell>
                                  ))
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
                    {Object.entries(io.outputs).map(
                        ([output_nmos_name, output_item]) => {
                            return expandedCols.includes(output_nmos_name) ? (
                                output_item.channels.map((channel, index) => (
                                    <TableCell
                                        align="center"
                                        style={{ color: '#76b900' }}
                                    >
                                        <Tooltip
                                            title={[channel.label, 'MUTE'].join(
                                                ' '
                                            )}
                                            placement="bottom"
                                        >
                                            <div>
                                                <IconButton disabled={is_show}>
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
                                ))
                            ) : (
                                <TableCell align="right">{''}</TableCell>
                            );
                        }
                    )}
                </TableRow>
                {Object.entries(io.inputs).map(
                    ([input_nmos_name, input_item]) => (
                        <>
                            <TableRow>
                                <TableCell
                                    align="center"
                                    rowSpan={
                                        expandedRows.includes(input_nmos_name)
                                            ? input_item.channels.length + 1
                                            : 1
                                    }
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
                                        expandedRows.includes(input_nmos_name)
                                            ? input_item.channels.length + 1
                                            : 1
                                    }
                                    colSpan={
                                        expandedRows.includes(input_nmos_name)
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
                                        onClick={event =>
                                            handleEpandRow(
                                                event,
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
                                {expandedRows.includes(input_nmos_name)
                                    ? null
                                    : Object.entries(io.outputs).map(
                                          ([output_nmos_name, output_item]) => {
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
                                ? Object.entries(input_item.channels).map(
                                      ([input_index, channel]) => (
                                          <TableRow>
                                              <TableCell
                                                  size="small"
                                                  style={{ color: '#76b900' }}
                                              >
                                                  {channel.label}
                                              </TableCell>
                                              <>
                                                  {Object.entries(
                                                      io.outputs
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
                                                                                      {/* <Checkbox disabled={is_show} checked={ischecked(input_nmos_name,output_nmos_name,input_index,index)} checkedIcon={<CheckCircleOutlineIcon/>} icon={<RadioButtonUncheckedIcon/>} onChange={event => handleMap(event, input_nmos_name,output_nmos_name,input_index,index)}>
                                                                    </Checkbox> */}
                                                                                      <IconButton
                                                                                          disabled={
                                                                                              is_show
                                                                                          }
                                                                                          onClick={event =>
                                                                                              handleMap(
                                                                                                  event,
                                                                                                  input_nmos_name,
                                                                                                  output_nmos_name,
                                                                                                  input_index,
                                                                                                  index
                                                                                              )
                                                                                          }
                                                                                      >
                                                                                          {ischecked(
                                                                                              input_nmos_name,
                                                                                              output_nmos_name,
                                                                                              input_index,
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
                                                                  {''}
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
    );
};

export default ChannelMappingMatrix;
