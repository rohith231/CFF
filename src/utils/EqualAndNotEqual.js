/**
 * getting the table copy and
 * Searching the exact match in the table
 * return the new table
 * @param {*} accessor 
 * @param {*} inputText 
 * @param {*} originalTable 
 * @param {*} setSearchTable 
 */

const SearchEqual = (accessor, inputText, originalTable, setSearchTable) => {
    let result = [];
    const searchData = inputText.toLowerCase();
    originalTable.filter((value) => {
        if (value[accessor] != null && value[accessor].toString().toLowerCase() === searchData) {
            result = [...result, value]
        }
    })
    if (result.length !== 0) {
        setSearchTable(result)
    } else if (!inputText) {
        setSearchTable(originalTable)
    }
}

/**
 * getting the table copy and
 * Searching the exact not match in the table
 * return the new table
 * @param {*} accessor 
 * @param {*} inputText 
 * @param {*} originalTable 
 * @param {*} setSearchTable 
 */

const SearchNotEqual = (accessor, inputText, originalTable, setSearchTable) => {
    let result = [];
    const searchData = inputText.toLowerCase();
    originalTable.filter((value) => {
        if (value[accessor] != null && value[accessor].toString().toLowerCase() !== searchData) {
            result = [...result, value]
        }
    })
    setSearchTable(result)
}


export {
    SearchEqual,
    SearchNotEqual,
}