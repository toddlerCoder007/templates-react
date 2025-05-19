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
import React, { useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type DataPoint = { label: string; value: number };

type Props = {
    data: DataPoint[];
};

const defaultColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#C9CBCF",
    "#8DD17E",
    "#FF6666",
];

const DonutChartWithCenteredDynamicText: React.FC<Props> = ({ data }) => {
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
    const highlightIndexRef = useRef<number | null>(null);
    highlightIndexRef.current = highlightIndex;

    let labels = data.map((d) => d.label);
    let values = data.map((d) => d.value);
    let backgroundColors = defaultColors.slice(0, labels.length);

    // Check if there are more than 9 data points
    if (data.length > 9) {
        // Sort data by value descending
        const sortedData = [...data].sort((a, b) => b.value - a.value);

        // Select top 8 and lump the rest into "Others"
        const topData = sortedData.slice(0, 8);
        const othersValue = sortedData.slice(8).reduce((sum, item) => sum + item.value, 0);

        labels = [...topData.map((d) => d.label), "Others"];
        values = [...topData.map((d) => d.value), othersValue];
        backgroundColors = defaultColors.slice(0, 8).concat("#AAAAAA"); // Add gray for "Others"
    }

    // Chart.js data format
    const chartData = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: backgroundColors,
                hoverBackgroundColor: backgroundColors,
            },
        ],
    };

    // Gray out non-highlighted slices if one is highlighted
    const getBackgroundColors = (): string[] => {
        if (highlightIndex === null) {
            return backgroundColors;
        }
        return backgroundColors.map((color, i) =>
            i === highlightIndexRef.current ? color : "#CCCCCC"
        );
    };

    // Plugin for center percentage text
    const centerTextPlugin: Plugin<"doughnut"> = {
        id: "centerText",
        beforeDraw(chart) {
            const { ctx } = chart;
            ctx.save();

            const dataset = chart.data.datasets[0].data as number[];
            const total = dataset.reduce((a, b) => a + b, 0);

            const index = highlightIndexRef.current;
            if (index === null) {
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
        cutout: "70%",
        plugins: {
            legend: {
                position: "right",
                onClick: (e: ChartEvent, legendItem: LegendItem) => {
                    const clickedIndex = legendItem.index;
                    if (clickedIndex === highlightIndexRef.current) {
                        setHighlightIndex(null);
                    } else {
                        setHighlightIndex(clickedIndex ?? null);
                    }
                },
                labels: {
                    usePointStyle: true,
                    generateLabels: function (chart) {
                        const data = chart.data;
                        const total = data.datasets[0].data.reduce((acc, value) => acc + value, 0);

                        // Generate labelSetA, labelSetB, and labelSetC
                        const labelSetA = data.labels.map((label) => label); // Labels (text)
                        const labelSetB = data.datasets[0].data.map((value) => value); // Values (raw value)
                        const labelSetC = data.datasets[0].data.map((value) => {
                            const percentage = ((value / total) * 100).toFixed(1) + "%";
                            return percentage;
                        }); // Percentages

                        // Combine the three sets into the final legend
                        const combinedLabels = labelSetA.map((label, i) => {
                            return {
                                text: `${label}: ${labelSetB[i]} (${labelSetC[i]})`,
                                index: i,
                                datasetIndex: -1,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                hidden: false
                            };
                        });

                        return combinedLabels;
                    },
                },
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label(context) {
                        const dataset = context.dataset.data as number[];
                        const total = dataset.reduce((a, b) => a + Number(b), 0);
                        const value = context.parsed as number;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };

    const updatedData = {
        ...chartData,
        datasets: [
            {
                ...chartData.datasets[0],
                backgroundColor: getBackgroundColors(),
            },
        ],
    };

    // Apply the custom class after the component renders
    useEffect(() => {
        const chartCanvas = document.querySelector("canvas");
        const legendContainer = chartCanvas?.closest(".chart-container")?.querySelector(".chart-legend");
        if (legendContainer) {
            legendContainer.classList.add("chart-legend");
        }
    }, []);

    return (
        <div className="chart-container" style={{ width: 450, height: 350 }}>
            <Doughnut
                data={updatedData}
                options={options}
                plugins={[centerTextPlugin]}
            />
            <div style={{ marginTop: 12, fontWeight: "bold", fontSize: 16 }}>
                {highlightIndex !== null
                    ? `Highlighted: ${labels[highlightIndex]}`
                    : "No highlight (showing all)"}
            </div>
        </div>
    );
};

export default DonutChartWithCenteredDynamicText;
