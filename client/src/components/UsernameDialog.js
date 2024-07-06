import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { styled } from '@mui/system';

const CustomDialog = styled(Dialog)({
    '& .MuiPaper-root': {
        backgroundColor: '#1e1e1e',
        color: '#ffffff',
    },
});

const CustomDialogTitle = styled(DialogTitle)({
    backgroundColor: '#2d2d2d',
    color: '#ffffff',
});

const CustomDialogContent = styled(DialogContent)({
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
});

const CustomDialogActions = styled(DialogActions)({
    backgroundColor: '#1e1e1e',
});

const UsernameDialog = ({ open, username, onUsernameChange, onSubmit }) => (
    <CustomDialog open={open} onClose={() => {}} disableBackdropClick>
        <CustomDialogTitle>Enter your username</CustomDialogTitle>
        <CustomDialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Username"
                fullWidth
                value={username}
                onChange={onUsernameChange}
                sx={{}}
                InputProps={{
                    style: {
                        color: '#ffffff',
                    },
                }}
                InputLabelProps={{
                    style: {
                        color: '#ffffff',
                    },
                }}
            />
        </CustomDialogContent>
        <CustomDialogActions>
            <Button onClick={onSubmit} color="primary">
                Enter
            </Button>
        </CustomDialogActions>
    </CustomDialog>
);

export default UsernameDialog;
