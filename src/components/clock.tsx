// DigitalClock.tsx
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const DigitalClock: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(dayjs());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = currentTime.format('D MMM YYYY HH:mm:ss').toUpperCase();

    return (
        <Grid container spacing={0} alignItems="center">
            <Grid item xs="auto">
                <TextField
                    value={formattedTime}
                    variant="standard"
                    inputProps={{ readOnly: true }}
                    InputProps={{
                        disableUnderline: true,
                        sx: {
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            padding: 0,
                            textAlign: 'right',
                        },
                    }}
                    sx={{
                        backgroundColor: 'transparent',
                        minWidth: 200,
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default DigitalClock;
