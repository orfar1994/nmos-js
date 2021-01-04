import React from 'react';
import { Loading } from 'react-admin';
import { useFormState } from 'react-final-form';
import get from 'lodash/get';
import { set } from 'lodash';
import MatrixHead from './Matrix';

const ChannelMappingMatrix = ({ record }) => {
    const active = get(record, '$active');
    const formState = useFormState().values;
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
        <MatrixHead
            record={record}
            is_show={false}
            mapping={click_box_1}
            handleMap={handleMap}
        />
    );
};

export default ChannelMappingMatrix;
