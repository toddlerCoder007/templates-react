import { Box, List, Typography } from '@mui/material';
import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Title,
    Tooltip
} from 'chart.js';
import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface DonutChartProps {
    data: [string, number][]; // Array of [category, value]
    mainCategory: string; // Title of the distribution
}

const DonutChart: React.FC<DonutChartProps> = ({ data, mainCategory }) => {
    const totalValue = data.reduce((acc, [, value]) => acc + value, 0);

    // Color palette: soft tones of blue, purple, red, orange, and green
    const colorPalette = [
        '#4a90e2', // Blue
        '#9b59b6', // Purple
        '#e74c3c', // Red
        '#f39c12', // Orange
        '#2ecc71', // Green
    ];

    // Initial dataset for the chart
    const [dataset, setDataset] = useState([
        {
            label: 'Distribution',
            data: data.map(([, value]) => value),
            backgroundColor: data.map((_, index) => colorPalette[index % colorPalette.length]),
            borderWidth: 1,
            hoverOffset: 4,
        },
    ]);

    // State to manage selected category
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Handle legend item click to toggle visibility of chart data
    const handleLegendClick = (legendItem: any) => {
        const { text } = legendItem;

        // If the same category is clicked again, reset it
        if (selectedCategory === text) {
            setSelectedCategory(null);
            resetChartColors(); // Reset all chart sections to original colors
        } else {
            setSelectedCategory(text);
            updateChartColors(text); // Highlight the selected category and gray out others
        }
    };

    // Update dataset to highlight the selected category and gray out others
    const updateChartColors = (category: string) => {
        const updatedBackgroundColor = data.map(([cat], index) =>
            cat === category ? colorPalette[index % colorPalette.length] : '#D3D3D3' // Gray out others
        );

        setDataset([
            {
                label: 'Distribution',
                data: data.map(([, value]) => value),
                backgroundColor: updatedBackgroundColor,
                borderWidth: 1,
                hoverOffset: 4,
            },
        ]);
    };

    // Reset dataset to show all categories in their original color
    const resetChartColors = () => {
        const resetBackgroundColor = data.map((_, index) => colorPalette[index % colorPalette.length]);

        setDataset([
            {
                label: 'Distribution',
                data: data.map(([, value]) => value),
                backgroundColor: resetBackgroundColor,
                borderWidth: 1,
                hoverOffset: 4,
            },
        ]);
    };

    // Find the largest value
    const largestValue = Math.max(...data.map(([, value]) => value));
    const largestValuePercentage = ((largestValue / totalValue) * 100).toFixed(1);

    // Prepare the legend data
    const legendData = data.map(([category, value]) => {
        const percentage = ((value / totalValue) * 100).toFixed(1);
        return {
            category,
            value,
            percentage,
        };
    });

    // Update the percentage in the middle based on selected category
    const selectedCategoryValue = selectedCategory
        ? data.find(([category]) => category === selectedCategory)?.[1]
        : null;
    const selectedCategoryPercentage = selectedCategoryValue
        ? ((selectedCategoryValue / totalValue) * 100).toFixed(1)
        : largestValuePercentage;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="h6" gutterBottom sx={{
                fontWeight: 'bold',
                paddingLeft: '1rem',
            }}>
                Distribution by {mainCategory}
            </Typography>
            {/* Chart and Legend Wrapper */}
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {/* Chart */}
                <Box sx={{ position: 'relative', width: 300, height: 300 }}>
                    <Doughnut
                        data={{ datasets: dataset }}
                        options={{
                            responsive: true,
                            plugins: {
                                tooltip: {
                                    enabled: false, // Disable tooltips
                                },
                                legend: {
                                    display: false, // Disable the default top legend
                                    onClick: (event, legendItem) => handleLegendClick(legendItem), // Custom click handler
                                },
                            },
                            cutout: '80%', // Makes the donut thinner
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '50px'
                        }}
                    >
                        {selectedCategory ? selectedCategoryPercentage : largestValuePercentage}%
                    </Box>
                </Box>

                {/* Custom Legend */}
                <Box sx={{
                    marginLeft: 2,
                    maxWidth: 250
                }}>
                    <List sx={{ padding: 0 }}>
                        {legendData.map(({ category, value, percentage }, index) => (
                            <Box
                                key={category}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: 1,
                                    cursor: 'pointer',
                                    justifyContent: 'space-between',
                                }}
                                onClick={() => handleLegendClick({ text: category })} // Toggle visibility
                            >
                                <Box
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%', // Circular legend box
                                        backgroundColor: colorPalette[index % colorPalette.length],
                                        marginRight: 2,
                                        display: 'inline-block',

                                    }}
                                />
                                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                                    <Typography sx={{}}>{category}</Typography>
                                    <Typography sx={{ minWidth: '60px', textAlign: 'right' }}>{value}</Typography>
                                    <Typography sx={{ minWidth: '60px', textAlign: 'right' }}>{percentage}%</Typography>
                                </Box>
                            </Box>
                        ))}
                    </List>
                </Box>
            </Box>
        </Box>
    );
};

export default DonutChart;
