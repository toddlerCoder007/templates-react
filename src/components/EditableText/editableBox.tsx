import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface AssessmentResponse {
    machineAssessment: string;
    userAssessment: string;
}

interface EditableBoxProps {
    title: string;
}

const EditableBox: React.FC<EditableBoxProps> = ({ title }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [machineSummary, setMachineSummary] = useState('');
    const [userSummary, setUserSummary] = useState('');
    const [currentText, setCurrentText] = useState('');
    const [originalText, setOriginalText] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch data on mount
    useEffect(() => {
        axios
            .get<AssessmentResponse>('/api/assessment')
            .then((res) => {
                const { machineAssessment, userAssessment } = res.data;
                setMachineSummary(machineAssessment);
                setUserSummary(userAssessment);

                const displayText = userAssessment ?? machineAssessment;
                setCurrentText(displayText);
                setOriginalText(displayText);
            })
            .catch(() => setError('Failed to fetch summary'))
            .finally(() => setLoading(false));
    }, []);

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleCancelClick = () => {
        setIsEditMode(false);
        setCurrentText(originalText);
    };

    const handleSaveClick = () => {
        setSaving(true);
        axios
            .post('/api/assessment', { userAssessment: currentText.trim() })
            .then(() => {
                setIsEditMode(false);
                setUserSummary(currentText.trim());
                setOriginalText(currentText.trim());
            })
            .catch(() => setError('Failed to save summary'))
            .finally(() => setSaving(false));
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                border: 'none',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{title}</Typography>
                {isEditMode ? (
                    <Box>
                        <Button onClick={handleSaveClick} disabled={saving}>
                            <Typography variant="h6">{saving ? 'Saving...' : 'Save'}</Typography>
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
                        value={currentText}
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
                                justifyContent: 'flex-start',
                            },
                            '& textarea': {
                                height: '100%',
                                alignItems: 'flex-start',
                            },
                        }}
                    />
                ) : (
                    <Typography
                        variant="body1"
                        sx={{ whiteSpace: 'pre-line' }}
                    >
                        {originalText}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default EditableBox;
