const TableHead = () => {
    return (
        <thead className='font-semibold text-white'>
            <tr>
                <td className='text-center border-r border-white py-2 px-2 md:px-3'>ID</td>
                <td className='text-center border-l border-r border-white'>Title</td>
                <td className='text-center border-l border-r border-white'>Description</td>
                <td className='text-center border-l border-r border-white px-6'>Price</td>
                <td className='text-center border-l border-r border-white min-w-[100px]'>Category</td>
                <td className='text-center border-l border-r border-white min-w-[100px] px-2'>Sold / Not</td>
                <td className='text-center border-l border-white'>Image</td>
            </tr>
        </thead>
    );
}

export default TableHead;
