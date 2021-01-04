import { IconButton } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const CollapseButton = ({ title, onClick, isExpend }) => (
    <IconButton size="small" title={title} onClick={onClick}>
        {isExpend ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
    </IconButton>
);

export default CollapseButton;
