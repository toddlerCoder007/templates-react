import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Grid, IconButton, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

interface EditableBoxProps {
    title: string;
    text: string;
    width: string;
    height: string;
}

const EditableBox: React.FC<EditableBoxProps> = ({ title, text, width, height }) => {
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
                width,
                height,
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{title}</Typography>
                {isEditMode ? (
                    <Box>
                        <IconButton onClick={handleSaveClick}>
                            <SaveIcon />
                        </IconButton>
                        <IconButton onClick={handleCancelClick}>
                            <CancelIcon />
                        </IconButton>
                    </Box>
                ) : (
                    <IconButton onClick={handleEditClick}>
                        <EditIcon />
                    </IconButton>
                )}
            </Grid>

            <Box mt={2}>
                {isEditMode ? (
                    <TextField
                        value={currentText}
                        onChange={(e) => setCurrentText(e.target.value)}
                        multiline
                        fullWidth
                        rows={4}
                        variant="outlined"
                    />
                ) : (
                    <Typography variant="body1">{currentText}</Typography>
                )}
            </Box>
        </Box>
    );
};

export default EditableBox;
