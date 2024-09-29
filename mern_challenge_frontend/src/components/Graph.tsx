// necessary imports 

import React from 'react';
import { BarChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Bar, ResponsiveContainer } from 'recharts';
import ApiData from '../interfaces/ApiData';

interface GraphProps {
    allApiData: ApiData[];
    selectedMonth: number; 
}

const Graph: React.FC<GraphProps> = ({ allApiData, selectedMonth }) => {

    const priceRanges = [
        { range: "0-100", count: 0 },
        { range: "101-200", count: 0 },
        { range: "201-300", count: 0 },
        { range: "301-400", count: 0 },
        { range: "401-500", count: 0 },
        { range: "501-600", count: 0 },
        { range: "601-700", count: 0 },
        { range: "701-800", count: 0 },
        { range: "801-900", count: 0 },
        { range: "901-above", count: 0 },
    ];

    allApiData.forEach(product => {
        const price = product.price;
        if (price < 100) priceRanges[0].count++;
        else if (price < 200) priceRanges[1].count++;
        else if (price < 300) priceRanges[2].count++;
        else if (price < 400) priceRanges[3].count++;
        else if (price < 500) priceRanges[4].count++;
        else if (price < 600) priceRanges[5].count++;
        else if (price < 700) priceRanges[6].count++;
        else if (price < 800) priceRanges[7].count++;
        else if (price < 900) priceRanges[8].count++;
        else priceRanges[9].count++;
    });

    // map month no to actual name of month
    const getMonthName = (month: number) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[month - 1];
    };

    return (
        <div className='mt-10'>
            <h2 className="sm:text-2xl md:text-3xl lg:text-3xl font-bold text-center text-blue-700 mb-6">
                Bar Chart Stats - <span className='text-red-600'>{getMonthName(selectedMonth)}</span>
            </h2>
            <div className="w-full h-96 md:h-400 lg:h-400">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceRanges} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#00BFFF" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Graph;
