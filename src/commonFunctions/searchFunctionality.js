//array format: [{id:1,item_name:"hello world"}]
const searchFunctionality = (searchedItem, arr, comparisionItem) => {
  if (!searchedItem) {
    return arr;
  } else {
    var resultArr = arr.filter((item) => {
      return item[comparisionItem]
        .toLowerCase()
        .includes(searchedItem.toLowerCase());
    });
    return resultArr;
  }
};

export default searchFunctionality;
