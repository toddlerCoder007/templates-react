import { ArcElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register required components of Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const PieChart = () => {
    // Data for the pie chart
    const data = {
        labels: ['Red', 'Blue', 'Yellow'], // Pie chart labels
        datasets: [
            {
                data: [300, 50, 100], // Corresponding values
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Segment colors
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Hover segment colors
            },
        ],
    };

    // Chart options with legend positioned on the side (right)
    const options = {
        plugins: {
            legend: {
                position: 'right', // This positions the legend to the right of the pie chart
                labels: {
                    usePointStyle: true, // Optional: makes the legend icons circular
                },
            },
        },
    };

    return (
        <div>
            <h2>My Pie Chart</h2>
            <Pie data={data} options={options} />
        </div>
    );
};

export default PieChart;
