import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

interface EditableBoxProps {
    title: string;
    text: string;
}

const EditableBox: React.FC<EditableBoxProps> = ({ title, text }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentText, setCurrentText] = useState(text);
    const [originalText, setOriginalText] = useState(text);

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleCancelClick = () => {
        setIsEditMode(false);
        setCurrentText(originalText); // Revert to the original text
    };

    const handleSaveClick = () => {
        setIsEditMode(false);
        setOriginalText(currentText); // Save the current text as the original text
    };

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                border: 'none', // Remove border of the entire container
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{title}</Typography>
                {isEditMode ? (
                    <Box>
                        <Button onClick={handleSaveClick}>
                            <Typography variant="h6">Save</Typography>
                        </Button>
                        <Button onClick={handleCancelClick}>
                            <Typography variant="h6">Cancel</Typography>
                        </Button>
                    </Box>
                ) : (
                    <IconButton onClick={handleEditClick}>
                        <EditIcon />
                    </IconButton>
                )}
            </Grid>

            <Box mt={2} sx={{ flex: 1 }}>
                {isEditMode ? (
                    <TextField
                        value={currentText} // This should be linked to currentText
                        onChange={(e) => setCurrentText(e.target.value)}
                        multiline
                        fullWidth
                        variant="outlined"
                        sx={{
                            height: '100%',
                            backgroundColor: 'lightgray',
                            '& .MuiOutlinedInput-root': {
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start', // Align content to the top
                                '&:focus': {
                                    border: 'none', // Remove border on focus
                                },
                            },
                            '& textarea': {
                                height: '100%', // Ensure the textarea fills the container
                                alignItems: 'flex-start', // Ensure the text aligns at the top
                            },
                        }}
                    />
                ) : (
                    <Typography
                        variant="body1"
                        sx={{
                            whiteSpace: 'pre-line', // Ensures newlines are respected
                        }}
                    >
                        {originalText}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default EditableBox;
