import React, { useEffect, useRef } from 'react';

const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
];

interface MonthSelectorProps {
    setIsSelectorOpen: (isOpen: boolean) => void;
    isSelectorOpen: boolean;
    selectedMonth: number;
    onMonthChange: (month: number) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ setIsSelectorOpen, isSelectorOpen, selectedMonth, onMonthChange }) => {
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const toggleDropdown = () => {
        setIsSelectorOpen(!isSelectorOpen);
    };

    const handleSelect = (month: number) => {
        onMonthChange(month);
        setIsSelectorOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsSelectorOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsSelectorOpen]);

    return (
        <div className="relative text-left w-[120px] md:w-[200px]" ref={dropdownRef}>
            <div className="flex justify-center">
                <button
                    onClick={toggleDropdown}
                    className="flex items-center justify-between w-full rounded-2xl px-2 py-1 md:px-4 md:py-2 border border-gray-300 bg-blue-500 text-white md:text-xl focus:outline-none focus:ring focus:ring-blue-300"
                >
                    {months.find(month => month.value === selectedMonth)?.label || 'Select a month'}
                    <svg
                        className={`w-5 h-5 transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06 0L10 10.34l3.71-3.13a.75.75 0 111 1.12l-4.25 3.5a.75.75 0 01-1 0l-4.25-3.5a.75.75 0 010-1.12z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            {isSelectorOpen && (
                <div className="absolute z-10 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {months.map(month => (
                            <button
                                key={month.value}
                                onClick={() => handleSelect(month.value)}
                                className={`flex items-center justify-between w-full px-4 py-2 text-left md:text-lg text-gray-700 hover:bg-blue-100 ${selectedMonth === month.value ? 'bg-blue-200 font-semibold' : ''}`}
                            >
                                {month.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthSelector;
