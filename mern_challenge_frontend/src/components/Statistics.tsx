import { useState, useEffect } from 'react';

const salesUrl = import.meta.env.VITE_SALES_URL;

interface Statistics {
    month: number,
}

const Statistics: React.FC<Statistics> = ({ month }) => {
    const [totalSales, setTotalSales] = useState<number>(0);
    const [soldItems, setSoldItems] = useState<number>(0);
    const [unsoldItems, setUnsoldItems] = useState<number>(0);

    const fetchSalesData = async () => {
        try {
            const response = await fetch(`${salesUrl}?month=${month}`, { method: "GET" });
            if (!response.ok) {
                throw new Error("Failed to fetch sales data");
            }

            const data = await response.json();
            setTotalSales(parseInt(data.totalSaleAmount));
            setSoldItems(parseInt(data.totalSoldItems));
            setUnsoldItems(parseInt(data.totalNotSoldItems));
        } catch (error) {
            console.error("Error fetching sales data:", error);
        }
    };

    useEffect(() => {
        fetchSalesData();
    }, [month]);

    // function to map month number to month name
    const getMonthName = (month: number): string => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[month - 1] || "Invalid Month";
    };

    return (
        <div className="w-[100vw] flex justify-center items-center xmt-4">
            <div className="w-[100%] md:w-[100%] lg:w-[85%] bg-white ">
                <h2 className="sm:text-2xl md:text-3xl lg:text-3xl font-bold text-center text-blue-700 mb-6">
                    Monthly Sales Statistics: <span className='text-red-600'>{getMonthName(month)}</span>
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead className="bg-blue-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-lg font-semibold text-gray-800 border border-gray-300">Metric</th>
                                <th className="px-6 py-4 text-left text-lg font-semibold text-gray-800 border border-gray-300">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white">
                                <td className="px-6 py-4 text-gray-700 font-medium border border-gray-300">Total Sales Amount</td>
                                <td className="px-6 py-4 text-gray-700 font-medium border border-gray-300">${totalSales.toFixed(2)}</td>
                            </tr>
                            <tr className="bg-blue-50">
                                <td className="px-6 py-4 text-gray-700 font-medium border border-gray-300">Sold Items</td>
                                <td className="px-6 py-4 text-gray-700 font-medium border border-gray-300">{soldItems}</td>
                            </tr>
                            <tr className="bg-white">
                                <td className="px-6 py-4 text-gray-700 font-medium border border-gray-300">Unsold Items</td>
                                <td className="px-6 py-4 text-gray-700 font-medium border border-gray-300">{unsoldItems}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
