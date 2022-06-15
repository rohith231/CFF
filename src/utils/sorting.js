/**
 * getting all these details from dashboard
 * and sorting the table as per sortOrder
 * @param {*} item 
 * @param {*} setSortOrder 
 * @param {*} TableData 
 * @param {*} sortOrder
 * @param {*} setData 
 */
const sortTable = (item, setSortOrder, Data, sortOrder, setData) => {
    setSortOrder(sortOrder == 'asc' ? 'desc' : 'asc')
    if (item) {
        const sorted = [...Data].sort((a, b) => {
            if (a[item] === null) return 1;
            if (b[item] === null) return -1;
            if (a[item] === null && b[item] === null) return 0;
            return (
                a[item].toString().localeCompare(b[item].toString(), "en", {
                    numeric: true,
                }) * (sortOrder === "asc" ? 1 : -1)
            );
        });
        setData(sorted);
    }
}

export default sortTable;