import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Plugin,
  Tooltip,
} from 'chart.js';
import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

// Register required elements
ChartJS.register(ArcElement, Tooltip);

// Sample data
const initialData = [300, 50, 100]; // Original dataset values
const chartData = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      data: [...initialData], // Data for the chart
      backgroundColor: ['red', 'blue', 'yellow'],
    },
  ],
};

// Total value for percentage calculation
const total = chartData.datasets[0].data.reduce((sum, val) => sum + val, 0);

// Custom legend plugin
const customLegendPlugin: Plugin<'doughnut'> = {
  id: 'customLegendPlugin',
  afterDraw(chart) {
    const { ctx, chartArea, data } = chart;

    const fontSize = 13;
    const lineHeight = 24;
    const circleRadius = 6; // Radius for the colored circle
    const spacing = 8;

    // Legend positioning
    const labelX = chartArea.left + chart.width / 2 + 40;
    const labelTextX = labelX + circleRadius + spacing;
    const valueX = labelTextX + 160;
    const percentX = valueX + 80;

    let y = chartArea.top + 20;

    ctx.font = `${fontSize}px sans-serif`;
    ctx.textBaseline = 'middle';

    // Loop over the labels to draw each custom legend item
    data.labels?.forEach((label, index) => {
      const value = data.datasets[0].data[index];
      const percent = ((value / total) * 100).toFixed(1) + '%';
      const color = (data.datasets[0].backgroundColor as string[])[index];

      // Color circle for the legend
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(labelX, y, circleRadius, 0, Math.PI * 2); // Draw circle
      ctx.fill();

      // Label text
      ctx.fillStyle = '#000';
      ctx.textAlign = 'left';
      ctx.fillText(`Series: ${label}`, labelTextX, y);

      // Value
      ctx.textAlign = 'right';
      ctx.fillText(value.toLocaleString(), valueX, y);

      // Percentage
      ctx.fillText(percent, percentX, y);

      // Add click listener for each legend item (using index to toggle visibility)
      chart.canvas.addEventListener('click', (event) => {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        const distance = Math.sqrt(
          (mouseX - labelX) ** 2 + (mouseY - y) ** 2
        );
        if (distance < circleRadius) {
          // Handle the toggle (toggle the visibility of the segment)
          const dataset = chartData.datasets[0];
          dataset.data[index] = dataset.data[index] === 0 ? initialData[index] : 0;
          chart.update(); // Re-render the chart with the updated data
        }
      });

      // Move to the next line for the next legend item
      y += lineHeight;
    });
  },
};

// Chart options to hide the default legend
const options: ChartOptions<'doughnut'> = {
  plugins: {
    legend: {
      display: false, // Hide the default legend
    },
  },
  cutout: '70%', // Adjust the doughnut cutout
};

// Full component with the Doughnut chart and custom legend plugin
const DonutChartWithCustomLegend: React.FC = () => {
  // Use state to trigger re-renders
  const [data, setData] = useState(chartData);

  return (
    <div style={{ position: 'relative', width: '700px' }}>
      <Doughnut
        data={data}
        options={options}
        plugins={[customLegendPlugin]}
      />
    </div>
  );
};

export default DonutChartWithCustomLegend;
