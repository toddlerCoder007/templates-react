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
import React, { useRef, useState } from "react";
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

    if (data.length > 9) {
        const sortedData = [...data].sort((a, b) => b.value - a.value);
        const topData = sortedData.slice(0, 8);
        const othersValue = sortedData.slice(8).reduce((sum, item) => sum + item.value, 0);

        labels = [...topData.map((d) => d.label), "Others"];
        values = [...topData.map((d) => d.value), othersValue];
        backgroundColors = defaultColors.slice(0, 8).concat("#AAAAAA");
    }

    const getBackgroundColors = (): string[] => {
        if (highlightIndex === null) return backgroundColors;
        return backgroundColors.map((color, i) =>
            i === highlightIndexRef.current ? color : "#CCCCCC"
        );
    };

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

    const chartData = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: getBackgroundColors(),
                hoverBackgroundColor: getBackgroundColors(),
            },
        ],
    };

    const options: ChartOptions<"doughnut"> = {
        responsive: true,
        cutout: "70%",
        layout: {
            padding: {
                right: 30, // ensures percentage text fits
            },
        },
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
                    font: {
                        family: "Courier New, monospace",
                        size: 10, // smaller to prevent cutoff
                    },
                    generateLabels: (chart) => {
                        const data = chart.data;
                        const labels = data.labels as string[];
                        const values = data.datasets[0].data as number[];
                        const total = values.reduce((acc, v) => acc + Number(v), 0);

                        return labels.map((label, i) => {
                            const value = values[i];
                            const percent = ((value / total) * 100).toFixed(1) + "%";

                            const paddedLabel = label.length > 10 ? label.slice(0, 10) : label.padEnd(10);
                            const paddedValue = String(value).padStart(5);
                            const paddedPercent = percent.padStart(6);

                            return {
                                text: `${paddedLabel} ${paddedValue} ${paddedPercent}`,
                                index: i,
                                datasetIndex: 0,
                                fillStyle: (data.datasets[0].backgroundColor as (string | undefined)[])[i] as string,
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

    return (
        <div className="chart-container" style={{ width: 480, height: 380 }}>
            <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
            <div style={{ marginTop: 12, fontWeight: "bold", fontSize: 16 }}>
                {highlightIndex !== null
                    ? `Highlighted: ${labels[highlightIndex]}`
                    : "No highlight (showing all)"}
            </div>
        </div>
    );
};

export default DonutChartWithCenteredDynamicText;
