import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-admin';
import { makeStyles } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles(theme => ({
    contained: {
        color: theme.palette.error.contrastText,
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark,
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                backgroundColor: theme.palette.error.main,
            },
        },
    },
    text: {
        color: theme.palette.error.main,
        '&:hover': {
            backgroundColor: fade(
                theme.palette.error.main,
                theme.palette.action.hoverOpacity
            ),
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
}));

const BackButton = ({ resource, id, record, variant = 'contained', size }) => {
    const classes = useStyles();
    const history = useHistory();
    const handleBack = () => {
        history.push(`/${resource}/${id}/show/Staged_Matrix`);
    };
    return (
        <Button
            className={
                variant === 'contained' ? classes.contained : classes.text
            }
            onClick={() => handleBack()}
            label="Back"
            variant={variant}
            size={size ? size : variant === 'contained' ? 'medium' : 'small'}
        >
            <ArrowBackIcon />
        </Button>
    );
};

export default BackButton;
