import React,{ useState}from 'react';
import { 
    Card,
    CardContent,
    Divider, 
    Grid, 
    Table,
    TableCell,
    TableHead,
    TableRow,
    TableBody,
    Tooltip,
    Checkbox,
} from '@material-ui/core';
import {
    ArrayInput,
    BooleanField,
    BooleanInput,
    SelectField,
    SelectInput,
    SimpleShowLayout,
    TextField,
    TextInput,
    ReferenceField,
    Loading,
} from 'react-admin';
import { useFormState } from 'react-final-form';
import get from 'lodash/get';
import has from 'lodash/has';
import { CardFormIterator } from '../../components/CardFormIterator';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import sanitizeRestProps from '../../components/sanitizeRestProps';
import ChipConditionalLabel from '../../components/ChipConditionalLabel';
import { set } from 'lodash';


// Passing react-admin props causes console spam
const SanitizedDivider = ({ ...rest }) => (
    <Divider {...sanitizeRestProps(rest)} />
);

const MQTTReceiver = ({ data }) => (
    <Grid container spacing={2}>
        {Object.keys(data).map(i => (
            <Grid item sm key={i}>
                <MQTTReceiverLeg data={data[i]} />
            </Grid>
        ))}
    </Grid>
);

const MQTTReceiverLeg = ({ data }) => {
    const params_ext = Object.keys(data).filter(x => x.startsWith('ext_'));
    return (
        <Card elevation={3}>
            <CardContent>
                <SimpleShowLayout record={data}>
                    {has(data, 'source_host') && (
                        <TextField source="source_host" label="Source Host" />
                    )}
                    {has(data, 'source_port') && (
                        <TextField source="source_port" label="Source Port" />
                    )}
                    {has(data, 'broker_protocol') && (
                        <TextField
                            source="broker_protocol"
                            label="Broker Protocol"
                        />
                    )}
                    {has(data, 'broker_authorization') && (
                        <SelectField
                            source="broker_authorization"
                            label="Broker Authorization"
                            choices={[
                                {
                                    id: true,
                                    name: <CheckIcon />,
                                },
                                {
                                    id: false,
                                    name: <ClearIcon />,
                                },
                                { id: 'auto', name: 'auto' },
                            ]}
                            translateChoice={false}
                        />
                    )}
                    {has(data, 'broker_topic') && (
                        <TextField source="broker_topic" label="Broker Topic" />
                    )}
                    {has(data, 'connection_status_broker_topic') && (
                        <TextField
                            source="connection_status_broker_topic"
                            label="Connection Status Broker Topic"
                        />
                    )}
                    {params_ext.length !== 0 && <SanitizedDivider />}
                    {params_ext.map(value => {
                        return (
                            <TextField
                                record={data}
                                source={value}
                                key={value}
                            />
                        );
                    })}
                </SimpleShowLayout>
            </CardContent>
        </Card>
    );
};

const MQTTReceiverEdit = ({ record }) => {
    const data = get(record, '$staged.transport_params');
    const uniqueKeys = Object.keys(
        data.reduce((result, obj) => Object.assign(result, obj), {})
    );
    const params_ext = uniqueKeys.filter(x => x.startsWith('ext_'));
    return (
        <ArrayInput
            label="Transport Parameters"
            source="$staged.transport_params"
        >
            <CardFormIterator disableRemove disableAdd>
                {uniqueKeys.includes('source_host') && (
                    <TextInput source="source_host" label="Source Host" />
                )}
                {uniqueKeys.includes('source_port') && (
                    <TextInput source="source_port" label="Source Port" />
                )}
                {uniqueKeys.includes('broker_protocol') && (
                    <TextInput
                        source="broker_protocol"
                        label="Broker Protocol"
                    />
                )}
                {uniqueKeys.includes('broker_authorization') && (
                    <SelectInput
                        source="broker_authorization"
                        label="Broker Authorization"
                        choices={[
                            { id: true, name: <CheckIcon /> },
                            { id: false, name: <ClearIcon /> },
                            { id: 'auto', name: 'auto' },
                        ]}
                        translateChoice={false}
                    />
                )}
                {uniqueKeys.includes('broker_topic') && (
                    <TextInput source="broker_topic" label="Broker Topic" />
                )}
                {uniqueKeys.includes('connection_status_broker_topic') && (
                    <TextInput
                        source="connection_status_broker_topic"
                        label="Connection Status Broker Topic"
                    />
                )}
                {params_ext.length !== 0 && <SanitizedDivider />}
                {params_ext.map(value => {
                    return (
                        <TextInput record={record} source={value} key={value} />
                    );
                })}
            </CardFormIterator>
        </ArrayInput>
    );
};

const RTPReceiver = ({ data }) => (
    <Grid container spacing={2}>
        {Object.keys(data).map(i => (
            <Grid item sm key={i}>
                <RTPReceiverLeg data={data[i]} />
            </Grid>
        ))}
    </Grid>
);

const RTPReceiverLeg = ({ data }) => {
    const params_ext = Object.keys(data).filter(x => x.startsWith('ext_'));
    return (
        <Card elevation={3}>
            <CardContent>
                <SimpleShowLayout record={data}>
                    {has(data, 'rtp_enabled') && (
                        <BooleanField
                            source="rtp_enabled"
                            label="RTP Enabled"
                        />
                    )}
                    {has(data, 'source_ip') && (
                        <TextField source="source_ip" label="Source IP" />
                    )}
                    {has(data, 'multicast_ip') && (
                        <TextField source="multicast_ip" label="Multicast IP" />
                    )}
                    {has(data, 'interface_ip') && (
                        <TextField source="interface_ip" label="Interface IP" />
                    )}
                    {has(data, 'destination_port') && (
                        <TextField
                            source="destination_port"
                            label="Destination Port"
                        />
                    )}
                    {has(data, 'fec_enabled') && <SanitizedDivider /> && (
                        <BooleanField
                            source="fec_enabled"
                            label="FEC Enabled"
                        />
                    )}
                    {has(data, 'fec_mode') && (
                        <TextField source="fec_mode" label="FEC Mode" />
                    )}
                    {has(data, 'fec_destination_ip') && (
                        <TextField
                            source="fec_destination_ip"
                            label="FEC Destination IP"
                        />
                    )}
                    {has(data, 'fec1D_destination_port') && (
                        <TextField
                            source="fec1D_destination_port"
                            label="FEC1D Destination Port"
                        />
                    )}
                    {has(data, 'fec2D_destination_port') && (
                        <TextField
                            source="fec2D_destination_port"
                            label="FEC2D Destination Port"
                        />
                    )}
                    {has(data, 'rtcp_enabled') && <SanitizedDivider /> && (
                        <BooleanField
                            source="rtcp_enabled"
                            label="RTCP Enabled"
                        />
                    )}
                    {has(data, 'rtcp_destination_ip') && (
                        <TextField
                            source="rtcp_destination_ip"
                            label="RTCP Destination IP"
                        />
                    )}
                    {has(data, 'rtcp_destination_port') && (
                        <TextField
                            source="rtcp_destination_port"
                            label="RTCP Destination Port"
                        />
                    )}
                    {params_ext.length !== 0 && <SanitizedDivider />}
                    {params_ext.map(value => {
                        return (
                            <TextField
                                record={data}
                                source={value}
                                key={value}
                            />
                        );
                    })}
                </SimpleShowLayout>
            </CardContent>
        </Card>
    );
};

const RTPReceiverEdit = ({ record }) => {
    const data = get(record, '$staged.transport_params');
    const uniqueKeys = Object.keys(
        data.reduce((result, obj) => Object.assign(result, obj), {})
    );
    const params_ext = uniqueKeys.filter(x => x.startsWith('ext_'));
    return (
        <ArrayInput
            label="Transport Parameters"
            source="$staged.transport_params"
        >
            <CardFormIterator disableRemove disableAdd>
                {uniqueKeys.includes('rtp_enabled') && (
                    <BooleanInput source="rtp_enabled" label="RTP Enabled" />
                )}
                {uniqueKeys.includes('source_ip') && (
                    <TextInput source="source_ip" label="Source IP" />
                )}
                {uniqueKeys.includes('multicast_ip') && (
                    <TextInput source="multicast_ip" label="Multicast IP" />
                )}
                {uniqueKeys.includes('interface_ip') && (
                    <TextInput source="interface_ip" label="Interface IP" />
                )}
                {uniqueKeys.includes('destination_port') && (
                    <TextInput
                        source="destination_port"
                        label="Destination Port"
                    />
                )}
                {uniqueKeys.includes('fec_enabled') && (
                    <BooleanInput source="fec_enabled" label="FEC Enabled" />
                )}
                {uniqueKeys.includes('fec_mode') && (
                    <TextInput source="fec_mode" label="FEC Mode" />
                )}
                {uniqueKeys.includes('fec_destination_ip') && (
                    <TextInput
                        source="fec_destination_ip"
                        label="FEC Destination IP"
                    />
                )}
                {uniqueKeys.includes('fec1D_destination_port') && (
                    <TextInput
                        source="fec1D_destination_port"
                        label="FEC1D Destination Port"
                    />
                )}
                {uniqueKeys.includes('fec2D_destination_port') && (
                    <TextInput
                        source="fec2D_destination_port"
                        label="FEC2D Destination Port"
                    />
                )}
                {uniqueKeys.includes('rtcp_enabled') && (
                    <BooleanInput source="rtcp_enabled" label="RTCP Enabled" />
                )}
                {uniqueKeys.includes('rtcp_destination_ip') && (
                    <TextInput
                        source="rtcp_destination_ip"
                        label="RTCP Destination IP"
                    />
                )}
                {uniqueKeys.includes('rtcp_destination_port') && (
                    <TextInput
                        source="rtcp_destination_port"
                        label="RTCP Destination Port"
                    />
                )}
                {params_ext.length !== 0 && <SanitizedDivider />}
                {params_ext.map(value => {
                    return (
                        <TextInput record={record} source={value} key={value} />
                    );
                })}
            </CardFormIterator>
        </ArrayInput>
    );
};

const WebSocketReceiver = ({ data }) => (
    <Grid container spacing={2}>
        {Object.keys(data).map(i => (
            <Grid item sm key={i}>
                <WebSocketReceiverLeg data={data[i]} />
            </Grid>
        ))}
    </Grid>
);

const WebSocketReceiverLeg = ({ data }) => {
    const params_ext = Object.keys(data).filter(x => x.startsWith('ext_'));
    return (
        <Card elevation={3}>
            <CardContent>
                <SimpleShowLayout record={data}>
                    {has(data, 'connection_authorization') && (
                        <SelectField
                            source="connection_authorization"
                            label="Connection Authorization"
                            choices={[
                                {
                                    id: true,
                                    name: <CheckIcon />,
                                },
                                {
                                    id: false,
                                    name: <ClearIcon />,
                                },
                                { id: 'auto', name: 'auto' },
                            ]}
                            translateChoice={false}
                        />
                    )}
                    {has(data, 'connection_uri') && (
                        <TextField
                            source="connection_uri"
                            label="Connection URI"
                        />
                    )}
                    {params_ext.length !== 0 && <SanitizedDivider />}
                    {params_ext.map(value => {
                        return (
                            <TextField
                                record={data}
                                source={value}
                                key={value}
                            />
                        );
                    })}
                </SimpleShowLayout>
            </CardContent>
        </Card>
    );
};

const WebSocketReceiverEdit = ({ record }) => {
    const data = get(record, '$staged.transport_params');
    const uniqueKeys = Object.keys(
        data.reduce((result, obj) => Object.assign(result, obj), {})
    );
    const params_ext = uniqueKeys.filter(x => x.startsWith('ext_'));
    return (
        <ArrayInput
            label="Transport Parameters"
            source="$staged.transport_params"
        >
            <CardFormIterator disableRemove disableAdd>
                {uniqueKeys.includes('connection_authorization') && (
                    <SelectInput
                        source="connection_authorization"
                        label="Connection Authorization"
                        choices={[
                            { id: true, name: <CheckIcon /> },
                            { id: false, name: <ClearIcon /> },
                            { id: 'auto', name: 'auto' },
                        ]}
                        translateChoice={false}
                    />
                )}
                {uniqueKeys.includes('connection_uri') && (
                    <TextInput source="connection_uri" label="Connection URI" />
                )}
                {params_ext.length !== 0 && <SanitizedDivider />}
                {params_ext.map(value => {
                    return (
                        <TextInput record={record} source={value} key={value} />
                    );
                })}
            </CardFormIterator>
        </ArrayInput>
    );
};

const ChannelMappingMatrix = ({ record, is_show}) => {
    const active = get(record, '$active');
    const io = get(record, '$io');
    const formState = useFormState().values;
    const [expandedCols, setExpandedCols] = React.useState([]);
    const [expandedRows, setExpandedRows] = React.useState([]);
    const [click_box_1, setclickbox_1] = React.useState(JSON.parse(JSON.stringify(active.map)));
    set(formState,`$staged.active`,click_box_1);
    
    if (!record.$active.map) return <Loading />;
    
    const handleEpandRow = (event, input_real_name) => {
        const currentExpandedRows = expandedRows;
        const isRowExpanded = currentExpandedRows.includes(input_real_name);
  
        let obj = {};
        isRowExpanded ? (obj[input_real_name] = false) :  (obj[input_real_name] = true);
  
        // If the row is expanded, we are here to hide it. Hence remove
        // it from the state variable. Otherwise add to it.
        const newExpandedRows = isRowExpanded ?
            currentExpandedRows.filter(name => name !== input_real_name) :
            currentExpandedRows.concat(input_real_name);
  
        setExpandedRows(newExpandedRows);
    }
    const handleEpandCol = (event, output_real_name) => {
        const currentExpandedCols = expandedCols;
        const isColExpanded = currentExpandedCols.includes(output_real_name);
  
        let obj = {};
        isColExpanded ? (obj[output_real_name] = false) :  (obj[output_real_name] = true);
        
  
        // If the row is expanded, we are here to hide it. Hence remove
        // it from the state variable. Otherwise add to it.
        const newExpandedCols = isColExpanded ?
            currentExpandedCols.filter(name => name !== output_real_name) :
            currentExpandedCols.concat(output_real_name);
  
        setExpandedCols(newExpandedCols);
    }

    const ischecked = (input_real_name, output_real_name, input_channel, output_channel ) => {
        const map_to_input = get(click_box_1,`${output_real_name}.${output_channel}.input`);
        const map_to_input_channel = get(click_box_1,`${output_real_name}.${output_channel}.channel_index`);
        return map_to_input===input_real_name && String(map_to_input_channel)===String(input_channel);
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
    }
    const handleMap = (event, input_real_name, output_real_name, input_channel, output_channel ) => {

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
        const map_to_input = get(click_box_1,`${output_real_name}.${output_channel}.input`);
        const map_to_input_channel = get(click_box_1,`${output_real_name}.${output_channel}.channel_index`);
        const currentclick_box_1 =JSON.parse(JSON.stringify(click_box_1));
        if(map_to_input===input_real_name && String(map_to_input_channel)===String(input_channel)){
            input_real_name = null;
            input_channel = null;
        }
        set(currentclick_box_1,`${output_real_name}.${output_channel}.input`,input_real_name);
        set(currentclick_box_1,`${output_real_name}.${output_channel}.channel_index`,input_channel);
        setclickbox_1(currentclick_box_1);
    };
    return(
        <Table border={1}>
            <TableHead>
                <TableRow>
                <TableCell style={{color: '#76b900'}} size="small" align="center" rowSpan={3} colSpan={3}>{"INPUTS \\ OUTPUTS"}</TableCell>
                    {Object.entries(io.outputs).map(([output_nmos_name, output_item]) => (
                        <TableCell align="center" colSpan ={expandedCols.includes(output_nmos_name) ? output_item.channels.length : 1} >
                            {output_item.source_id ?
                            <ReferenceField
                                record={output_item}
                                basePath="/sources"
                                label="Sources"
                                source="source_id"
                                reference="sources"
                                link="show"
                            >
                                <ChipConditionalLabel source="label" />
                            </ReferenceField>:
                            null
                            }                                    
                        </TableCell>
                    ))}
                </TableRow>
                <TableRow>
                    {Object.entries(io.outputs).map(([output_nmos_name, output_item]) => (
                        <TableCell style={{color: '#76b900'}} size="small" align="center" colSpan ={expandedCols.includes(output_nmos_name) ? output_item.channels.length : 1} rowSpan={expandedCols.includes(output_nmos_name) ? 1 : 2}>
                            <IconButton aria-label="expand col" size="small" title={expandedCols.includes(output_nmos_name) ? "Hide output's channels" : "View output's channels"} onClick={event => handleEpandCol(event, output_nmos_name)}>
                                {expandedCols.includes(output_nmos_name) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                            {output_item.properties.name}
                        </TableCell>
                    ))}
                </TableRow>
                <TableRow>
                    {Object.entries(io.outputs).map(([output_nmos_name, output_item]) => {
                        return(expandedCols.includes(output_nmos_name) ?
                                    output_item.channels.map(channel => (
                                        <TableCell align="center" size="small" style={{color: '#76b900'}}>
                                            {channel.label}
                                        </TableCell>
                                    ))
                                    : null);
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell align="center" colSpan={3} style={{color: '#76b900'}}>{"MUTE"}</TableCell>
                    {Object.entries(io.outputs).map(([output_nmos_name, output_item]) =>{
                        return(expandedCols.includes(output_nmos_name) ?
                                output_item.channels.map((channel, index) => (
                                    <TableCell align="center" style={{color: '#76b900'}}>
                                        <Tooltip title={[channel.label,"MUTE"].join(' ')} placement="bottom">
                                            <div>
                                                
                                                <IconButton disabled={is_show} >
                                                    {ischecked(null,output_nmos_name,null,index)? <CheckCircleOutlineIcon/>:<RadioButtonUncheckedIcon/>}
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
                                    )):
                                <TableCell align="right">{""}</TableCell>
                        );
                    })}
                </TableRow>
                {Object.entries(io.inputs).map(([input_nmos_name, input_item]) => (
                    <>
                    <TableRow>
                        <TableCell align="center" rowSpan ={expandedRows.includes(input_nmos_name) ? input_item.channels.length + 1 : 1} >
                            {input_item.parent.type === "source" ?
                                <ReferenceField
                                    record={input_item}
                                    basePath="/sources"
                                    label="Sources"
                                    source="parent.id"
                                    reference="sources"
                                    link="show"
                                >
                                    <ChipConditionalLabel source="label" />
                                </ReferenceField> :
                                input_item.parent.type === "receiver" ?
                                <ReferenceField
                                    record={input_item}
                                    basePath="/receivers"
                                    label="Receivers"
                                    source="parent.id"
                                    reference="receivers"
                                    link="show"
                                >
                                    <ChipConditionalLabel source="label" />
                                </ReferenceField>:
                                null
                            }                                    
                        </TableCell>
                        <TableCell style={{color: '#76b900'}} size="small" rowSpan ={expandedRows.includes(input_nmos_name) ? input_item.channels.length + 1 : 1} colSpan={expandedRows.includes(input_nmos_name) ? 1 : 2}>
                            <IconButton aria-label="expand row" size="small" title={expandedRows.includes(input_nmos_name) ? "Hide input's channels" : "View input's channels"} onClick={event => handleEpandRow(event, input_nmos_name)}>
                                {expandedRows.includes(input_nmos_name) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                            {input_item.properties.name}
                        </TableCell>
                        {expandedRows.includes(input_nmos_name) ?
                            null:
                            Object.entries(io.outputs).map(([output_nmos_name, output_item]) =>{
                                return(expandedCols.includes(output_nmos_name) ?
                                            output_item.channels.map(() =>(
                                                <TableCell align="right">{""}</TableCell> 
                                            )):
                                            <TableCell align="right">{""}</TableCell>
                                );
                        })}
                    </TableRow>
                    {expandedRows.includes(input_nmos_name) ?
                        Object.entries(input_item.channels).map(([input_index, channel])=> (
                            <TableRow>
                                <TableCell size="small" style={{color: '#76b900'}}>{channel.label}</TableCell>
                                <>
                                    {Object.entries(io.outputs).map(([output_nmos_name, output_item]) =>{
                                        return(
                                            expandedCols.includes(output_nmos_name) ?
                                            output_item.channels.map((output_channel,index) =>{
                                                return <TableCell align="center" style={{color: '#76b900'}}>
                                                            <Tooltip title={[output_channel.label,channel.label].join(' ')} placement="bottom">
                                                                <div>
                                                                    {/* <Checkbox disabled={is_show} checked={ischecked(input_nmos_name,output_nmos_name,input_index,index)} checkedIcon={<CheckCircleOutlineIcon/>} icon={<RadioButtonUncheckedIcon/>} onChange={event => handleMap(event, input_nmos_name,output_nmos_name,input_index,index)}>
                                                                    </Checkbox> */}
                                                                    <IconButton disabled={is_show} onClick={event => handleMap(event, input_nmos_name,output_nmos_name,input_index,index)}>
                                                                        {ischecked(input_nmos_name,output_nmos_name,input_index,index)? <CheckCircleOutlineIcon/>:<RadioButtonUncheckedIcon />}
                                                                    </IconButton>
                                                                </div>
                                                            </Tooltip>
                                                        {/* <Radio
                                                        checked={ischecked(input_nmos_name,output_nmos_name,input_index,index)}
                                                        onChange={event => handleChange(event)}
                                                        name="radio-button-demo"
                                                        /> */}
                                                        </TableCell>;
                                            }) :
                                            <TableCell align="right">{""}</TableCell>
                                        );
                                    })}
                                </>

                            </TableRow>
                        )) : null
                    }
                    </>
                ))}
            </TableBody>
        </Table>
    );

    // const data = [];
    // if (ids) {
    //     for (let i in ids) {
    //         data.push(JSON.parse(ids[i]));
    //     }
    //     switch (type) {
    //         case 'urn:x-nmos:transport:mqtt':
    //             return <MQTTReceiver data={data} />;
    //         case 'urn:x-nmos:transport:rtp':
    //             return <RTPReceiver data={data} />;
    //         case 'urn:x-nmos:transport:websocket':
    //             return <WebSocketReceiver data={data} />;
    //         default:
    //             return <b>Unknown Type</b>;
    //     }
    // } else {
    //     switch (type) {
    //         case 'urn:x-nmos:transport:mqtt':
    //             return <MQTTReceiverEdit record={record} />;
    //         case 'urn:x-nmos:transport:rtp':
    //             return <RTPReceiverEdit record={record} />;
    //         case 'urn:x-nmos:transport:websocket':
    //             return <WebSocketReceiverEdit record={record} />;
    //         default:
    //             return <b>Unknown Type</b>;
    //     }
    // }
};

export default ChannelMappingMatrix;
