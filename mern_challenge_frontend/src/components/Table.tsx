import { useEffect, useState, useRef } from "react";
import { TableHead, MonthSelector } from "../component_fragments/";
import ApiData from "../interfaces/ApiData";
import left from '../assets/arrow.png';
import Statistics from "./Statistics";
import { Graph } from ".";

const apiUrl = import.meta.env.VITE_SERVER_URL;

const Table: React.FC = () => {
    const [apiData, setApiData] = useState<ApiData[]>([]);
    const [allApiData, setAllApiData] = useState<ApiData[]>([]);
    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<number>(2);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [pagination, setPagination] = useState<number>(10);
    const selectorRef = useRef<HTMLDivElement>(null);

    const fetchData = async (month: number) => {
        try {
            const response = await fetch(`${apiUrl}?page=1&limit=1000&month=${month}`, { method: "GET" });
            if (!response.ok) {
                throw new Error("Failed to fetch batches");
            }
            const resData = await response.json();
            setAllApiData(resData.data); // Store fetched data for searching
            setApiData(resData.data.slice(0, pagination)); // Show paginated data
            setTotalPages(Math.ceil(resData.data.length / pagination));
            setPageNo(1);
        } catch (error) {
            console.error('Error fetching API data:', error);
        }
    };

    const handleSearch = () => {
        const filteredData = allApiData.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.price.toString().includes(searchTerm)
        );
        setApiData(filteredData.slice((pageNo - 1) * pagination, pageNo * pagination));
        setTotalPages(Math.ceil(filteredData.length / pagination));
    };

    useEffect(() => {
        fetchData(selectedMonth);
    }, [selectedMonth]);

    useEffect(() => {
        handleSearch();
    }, [searchTerm, pageNo, pagination]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
                setIsSelectorOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handlePreviousPage = () => {
        if (pageNo > 1) {
            setPageNo(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (pageNo < totalPages) {
            setPageNo(prev => prev + 1);
        }
    };

    const handleMonthChange = (month: number) => {
        setSelectedMonth(month);
    };

    return (
        <>
            <div className='w-[100vw] overflow-x-hidden'>
                <div className='w-[100%] px-1 py-6 sm:px-4 sm:py-6 lg:px-14 lg:pt-14'>
                    <nav className='flex justify-center mb-4 lg:mb-10'>
                        <span className='text-2xl sm:text-2xl md:text-3xl lg:text-5xl text-blue-700 font-semibold'>Transactions Dashboard</span>
                    </nav>
                    <div className='bg-white px-2 py-4 lg:px-6 lg:py-4 justify-end'>
                        <nav className='flex gap-2 md:gap-2 justify-end mr-2'>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="border w-[100%] h-full md:w-[400px] rounded-full px-4 py-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div ref={selectorRef}>
                                <MonthSelector
                                    setIsSelectorOpen={setIsSelectorOpen}
                                    isSelectorOpen={isSelectorOpen}
                                    selectedMonth={selectedMonth}
                                    onMonthChange={handleMonthChange}
                                />
                            </div>
                        </nav>
                        <div className="overflow-x-auto">
                            <table className='w-full mt-10 bg-blue-500 my-4 lg:text-lg rounded-3xl'>
                                <TableHead />
                                <tbody className='bg-white'>
                                    {apiData.length > 0 ? (
                                        apiData.map((data, index) => (
                                            <tr key={data.id} className={`text-center ${(index % 2 === 0) ? "bg-gray-200" : "bg-white"}`}>
                                                <td className='py-1 border border-black'>{data.id}</td>
                                                <td className="border border-black">{data.title}</td>
                                                <td className="border border-black">{data.description.length > 50 ? data.description.substring(0, 50) + '...' : data.description}</td>
                                                <td className="border border-black">{data.price.toFixed(3)}</td>
                                                <td className="border border-black">{data.category}</td>
                                                <td className="border border-black">{data.sold ? "Yes" : "No"}</td>
                                                <td className="border border-black flex items-center justify-center px-2 py-2">
                                                    <img 
                                                        src={data.image} 
                                                        alt={data.title} 
                                                        className="max-w-[100px] h-auto object-contain" // Responsive styling
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className='text-center bg-gray-200'>
                                            <td colSpan={10} className='py-4 text-lg'>No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="w-full mt-3 flex flex-col md:flex-row gap-4 md:gap-20 md:justify-end px-4 lg:px-20">
                            <span className='flex font-semibold gap-14 md:gap-28 items-center'>
                                Total Pages: {totalPages}
                                <div className="flex gap-4 items-center cursor-pointer">
                                    <img src={left} alt="Previous Page" className='h-6 md:h-8 rotate-180 cursor-pointer' onClick={handlePreviousPage} />
                                    Page: {pageNo}
                                    <img src={left} alt="Next Page" className='h-6 md:h-8 cursor-pointer' onClick={handleNextPage} />
                                </div>
                            </span>
                            <form onSubmit={(e) => e.preventDefault()}>
                                Enter Pagination:
                                <input
                                    type="number"
                                    className="w-16 outline-none bg-gray-100 px-2 py-1"
                                    placeholder="10"
                                    value={pagination}
                                    onChange={e => {
                                        const value = parseInt(e.target.value);
                                        if (value > 0) {
                                            setPagination(value);
                                        }
                                    }}
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Statistics month={selectedMonth} />
            <Graph allApiData={allApiData} selectedMonth={selectedMonth}/>
        </>
    );
};

export default Table;
