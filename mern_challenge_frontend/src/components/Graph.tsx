import React, { useEffect, useState } from 'react';
import {
    BarChart,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    Bar,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface GraphProps {
    selectedMonth: number; // Expecting a month as an integer (1-12)
}

interface PieChartData {
    category: string;
    percentage: number; // Ensure this is a number
}

interface BarChartData {
    priceRange: string;
    count: number; // Ensure this is a number
}

const graphApiBar = import.meta.env.VITE_BAR_GRAPH;
const graphApiPie = import.meta.env.VITE_PIE_GRAPH;

const Graph: React.FC<GraphProps> = ({ selectedMonth }) => {
    const [priceRanges, setPriceRanges] = useState<BarChartData[]>([]);
    const [pieData, setPieData] = useState<PieChartData[]>([]);
    const [error, setError] = useState<string | null>(null); // Add error state for UI feedback

    // Fetch Bar Chart Data
    useEffect(() => {
        const fetchPriceRanges = async () => {
            if (!selectedMonth) return;

            try {
                const response = await fetch(`${graphApiBar}?month=${selectedMonth}`);

                if (!response.ok) {
                    throw new Error(`Error fetching bar chart data: ${response.statusText}`);
                }
                const data: { [key: string]: number } = await response.json();

                const formattedData: BarChartData[] = Object.entries(data).map(([priceRange, count]) => ({
                    priceRange,
                    count: count, // Ensure count is treated as a number
                }));

                setPriceRanges(formattedData);
            } catch (error) {
                console.error('Error fetching bar chart data:', error);
                setError('Failed to fetch bar chart data.'); // Set error for UI
            }
        };

        fetchPriceRanges();
    }, [selectedMonth]);

    // Fetch Pie Chart Data
    useEffect(() => {
        const fetchPieData = async () => {
            if (!selectedMonth) return;

            try {
                const response = await fetch(`${graphApiPie}?month=${selectedMonth}`);

                if (!response.ok) {
                    throw new Error(`Error fetching pie chart data: ${response.statusText}`);
                }

                const data = await response.json();

                if (data.categories && Array.isArray(data.categories)) {
                    const formattedData: PieChartData[] = data.categories.map((item: { category: string; percentage: string }) => ({
                        category: item.category,
                        percentage: parseFloat(item.percentage), // Convert percentage to number
                    }));

                    setPieData(formattedData);
                } else {
                    console.error('Categories not found in the pie chart response data:', data);
                    setPieData([]);
                }
            } catch (error) {
                console.error('Error fetching pie chart data:', error);
                setError('Failed to fetch pie chart data.'); // Set error for UI
            }
        };

        fetchPieData();
    }, [selectedMonth]);

    // Utility to get month name
    const getMonthName = (month: number) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[month - 1]; // Adjust for 1-12 month input
    };

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

    return (
        <div className='mt-10'>
            {error && <div className="text-red-500 text-center">{error}</div>} {/* Display error message */}
            <h2 className="sm:text-2xl md:text-3xl lg:text-3xl font-bold text-center text-blue-700 mb-6">
                Stats for <span className='text-red-600'>{getMonthName(selectedMonth)}</span>
            </h2>
            <div className="flex flex-col md:flex-row gap-10">
                {/* Bar Chart */}
                <div className="w-full h-96 md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={priceRanges} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="priceRange" />
                            <YAxis />
                            <Tooltip formatter={(value) => [value, 'Count']} />
                            <Legend />
                            <Bar dataKey="count" fill="#00BFFF" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="w-full h-96 md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="percentage"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#82ca9d"
                                label
                            >
                                {pieData.map((_,index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Graph;
