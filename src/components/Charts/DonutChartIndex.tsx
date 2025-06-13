import { Box, Typography } from "@mui/material";
import {
    ArcElement,
    ChartEvent,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LegendItem,
    Plugin,
    Tooltip,
} from "chart.js";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { LEGEND_COLORS } from "../../../../constants/legendColors";
import { IDonutChartProps } from "../../../../interfaces/DonutChart.interface";

ChartJS.register(ArcElement, Tooltip, Legend);

export const DonutChart: React.FC<IDonutChartProps> = ({
    data,
    mainCategory,
}: IDonutChartProps) => {
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
    const highlightIndexRef = useRef<number | null>(null);
    highlightIndexRef.current = highlightIndex;

    const prepareData = () => {
        let labels = data.map((d) => d.label);
        let values = data.map((d) => d.value);
        const DISPLAY_TOP_K_FIELDS = 10;

        let backgroundColors = LEGEND_COLORS.slice(0, labels.length);
        if (data.length > DISPLAY_TOP_K_FIELDS) {
            const sortedData = [...data].sort((a, b) => b.value - a.value);

            const top9Data = sortedData.slice(0, DISPLAY_TOP_K_FIELDS - 1);
            const othersValue = sortedData
                .slice(DISPLAY_TOP_K_FIELDS - 1)
                .reduce((sum, item) => sum + item.value, 0);

            labels = [...top9Data.map((d) => d.label), "Others"];
            values = [...top9Data.map((d) => d.value), othersValue];
            backgroundColors = LEGEND_COLORS.slice(
                0,
                DISPLAY_TOP_K_FIELDS - 1
            ).concat("#AAAAAA");
        }

        return { labels, values, backgroundColors };
    };

    const { labels, values, backgroundColors } = prepareData();

    const getBackgroundColors = useCallback((): string[] => {
        console.log("getBackgroudColors");
        if (highlightIndex === null) {
            return backgroundColors;
        }
        return backgroundColors.map((color, i) =>
            i === highlightIndexRef.current ? color : "#CCCCCC"
        );
    }, [backgroundColors, highlightIndex]);

    const backgroundColorRef = useRef(getBackgroundColors());

    const centerTextPlugin: Plugin<"doughnut"> = {
        id: "centerText",
        beforeDraw(chart) {
            const { ctx } = chart;
            ctx.save();

            const dataset = chart.data.datasets[0].data as number[];
            const total = dataset.reduce((a, b) => a + b, 0);

            const index = highlightIndexRef.current;

            if (index === null || !chart.getDatasetMeta(0).data[index]) {
                ctx.restore();
                return;
            }

            const value = dataset[index];
            const percentage = ((value / total) * 100).toFixed(1) + "%";

            const meta = chart.getDatasetMeta(0);
            if (!meta.data || meta.data.length === 0) {
                ctx.restore();
                return;
            }
            const centerX = meta.data[0].x;
            const centerY = meta.data[0].y;

            ctx.font = "bold 28px Arial";
            ctx.fillStyle = "#000";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";

            ctx.fillText(percentage, centerX, centerY);
            ctx.restore();
        },
    };

    const options: ChartOptions<"doughnut"> = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "80%",
        layout: {
            padding: 0,
        },
        plugins: {
            legend: {
                // display: false,
                position: "right",
                onClick: (_: ChartEvent, legendItem: LegendItem) => {
                    const clickedIndex = legendItem.index;
                    if (clickedIndex === highlightIndexRef.current) {
                        setHighlightIndex(null);
                    } else {
                        setHighlightIndex(clickedIndex ?? null);
                    }
                },
                labels: {
                    usePointStyle: true,
                    font: {
                        family: "Courier New, monospace",
                        size: 12,
                    },
                    generateLabels: (chart) => {
                        const data = chart.data;
                        const labels = data.labels as string[];
                        const values = data.datasets[0].data as number[];
                        const total = values.reduce((acc, v) => acc + Number(v), 0);

                        return labels.map((label, i) => {
                            const value = values[i];
                            const percent = ((value / total) * 100).toFixed(1) + "%";

                            const paddedLabel =
                                label.length > 10 ? label.slice(0, 10) : label.padEnd(10);
                            const paddedValue = String(value).padStart(5);
                            const paddedPercent = percent.padStart(6);

                            return {
                                text: `${paddedLabel} ${paddedValue} ${paddedPercent}`,
                                index: i,
                                datasetIndex: 0,
                                fillStyle: (
                                    data.datasets[0].backgroundColor as (string | undefined)[]
                                )[i]!,
                                hidden: false,
                            };
                        });
                    },
                },
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label(context) {
                        const dataset = context.dataset.data;
                        const total = dataset.reduce((a, b) => a + Number(b), 0);
                        const value = context.parsed;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${percentage}%`;
                    },
                },
            },
        },
    };

    const [updatedData, setUpdatedData] = useState({
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: backgroundColorRef.current,
            },
        ],
    });

    // const updateChartData = () => {
    //   const newData = {
    //     labels,
    //     datasets: [
    //       {
    //         data: values,
    //         backgroundColor: backgroundColorRef.current,
    //       },
    //     ],
    //   };
    //   setUpdatedData(newData);
    // };

    useEffect(() => {
        backgroundColorRef.current = getBackgroundColors();
    }, [getBackgroundColors]);

    const newData = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: backgroundColorRef.current,
            },
        ],
    };

    useEffect(() => {
        setUpdatedData(newData);
    }, [data, highlightIndex]);

    return (
        <Box
            data-testid={`${mainCategory}-donut-chart-box`}
            sx={{
                backgroundColor: "white",
                width: "33%",
                height: "300px",
                color: "black",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
            }}
        >
            <Typography
                variant="h6"
                gutterBottom
                sx={{
                    fontWeight: "bold",
                    paddingLeft: "1rem",
                    fontSize: "14px",
                    paddingTop: "12px",
                }}
            >
                Distribution by {mainCategory}
            </Typography>

            {/* check if data available */}
            {data.length === 0 ? (
                <Box ml={4} mt={2}>
                    <Typography>No data available</Typography>
                </Box>
            ) : (
                <Box
                    mt={-5}
                    sx={{
                        width: "100%",
                        height: "100%",
                        padding: "16px",
                    }}
                >
                    <Doughnut
                        data={updatedData}
                        options={options}
                        plugins={[centerTextPlugin]}
                    />
                </Box>
            )}
        </Box>
    );
};
