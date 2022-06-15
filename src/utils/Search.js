/**
 * getting the table copy and
 * Searching the data in the table
 * return the new table
 * @param {*} accessor 
 * @param {*} index 
 * @param {*} inputText 
 */

const SearchData = (item, inputText, originalTable, setSearchTable) => {
    let result = [];
    const searchData = inputText.toLowerCase();
    originalTable.filter((value) => {
        if (value[item] != null && value[item].toString().toLowerCase().includes(searchData)) {
            result = [...result, value]
        }
    })
    setSearchTable(result)
}

export default SearchData;