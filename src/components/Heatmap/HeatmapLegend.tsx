import { Box, Typography } from "@mui/material";

const heatColors = [
    { label: "Very Low", color: "#f1eef6" },
    { label: "Low", color: "#bdc9e1" },
    { label: "Medium", color: "#74a9cf" },
    { label: "High", color: "#2b8cbe" },
    { label: "Very High", color: "#045a8d" },
];

export default function HeatMapLegend() {
    return (
        <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography variant="subtitle1" gutterBottom>Heatmap Legend</Typography>
            <Box display="flex" gap={1}>
                {heatColors.map((item) => (
                    <Box key={item.label} display="flex" flexDirection="column" alignItems="center">
                        <Box
                            width={30}
                            height={15}
                            bgcolor={item.color}
                            border="1px solid #ccc"
                        />
                        <Typography variant="caption">{item.label}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
