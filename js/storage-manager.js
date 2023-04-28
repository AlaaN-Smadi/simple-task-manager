'use strict';

class StorageManager{
    static loadData(){
        let jsonData = localStorage.getItem("my-list-data");
        let data = JSON.parse(jsonData);
    
        if(data && data.length){
            data.forEach(listItem => {
                Index.globalState.listData.push(listItem);
                Index.appendItem(listItem);
            });
        }
    }
    
    static saveData(data){
        let jsonData= JSON.stringify(data);
        localStorage.setItem("my-list-data", jsonData);
    }
}