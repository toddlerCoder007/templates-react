import { Box, Paper, Typography } from '@mui/material';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TrendGraphProps {
    data: { month: string; incCount: number }[];
}

const TrendGraph: React.FC<TrendGraphProps> = ({ data }) => {
    // Prepare the data for the chart
    const months = data.map(item => item.month);
    const incCounts = data.map(item => item.incCount);

    const chartData = {
        labels: months,
        datasets: [
            {
                label: 'Inc Count',
                data: incCounts,
                backgroundColor: '#000080',  // Solid navy color
                borderColor: '#000080',  // Solid navy color for the border
                borderWidth: 1,
                borderRadius: 5, // Rounded edges for all bars
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: false, // Title will be handled by MUI Typography
            },
            legend: {
                display: false, // This hides the legend
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // Hide the grid lines on the x-axis
                },
                border: {
                    color: 'transparent', // Remove the x-axis line
                },
                ticks: {
                    display: false,  // This hides the tick labels on the x-axis
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false, // Hide the grid lines on the y-axis
                },
                border: {
                    color: 'transparent', // Remove the y-axis line
                },
            },
        },
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5" gutterBottom align="center">
                    Trend Graph
                </Typography>
                <Box sx={{ height: 400 }}>
                    <Bar data={chartData} options={options} />
                </Box>
            </Paper>
        </Box>
    );
};

export default TrendGraph;
