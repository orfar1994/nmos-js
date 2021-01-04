import { IconButton, Tooltip } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

const MappingButton = ({ tooltip_title, disabeld, onClick, ischecked }) => (
    <Tooltip title={tooltip_title} placement="bottom">
        <div>
            <IconButton disabled={disabeld} onClick={onClick}>
                {ischecked ? (
                    <CheckCircleOutlineIcon />
                ) : (
                    <RadioButtonUncheckedIcon />
                )}
            </IconButton>
        </div>
    </Tooltip>
);

export default MappingButton;
