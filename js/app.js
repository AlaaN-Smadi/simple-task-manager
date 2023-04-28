"use strict";

class Index {
    static globalState = { listData: [], selectorList: null, inputListItem: null, submitListItem: null, clearListItem: null };

    static appendItem = (itemData) => {
        if (!itemData.title) {
            return console.error('missing task title');
        }

        let emptyStateContainer = document.querySelector('.empty-state');
        if (emptyStateContainer) {
            emptyStateContainer.remove();
        }

        let listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="form-check"> 
                <label class="form-check-label"> 
                    <input class="checkbox" type="checkbox"> 
                    ${itemData.title}
                    <i class="input-helper"></i>
                </label> 
            </div> 
            <i class="remove mdi mdi-close-circle-outline"></i>`;

        let checkBox = listItem.querySelector('input');
        let deleteBtn = listItem.querySelector('.remove');

        checkBox.addEventListener('change', () => this.completeManager(listItem, checkBox.checked));
        deleteBtn.addEventListener('click', () => this.deleteItem(listItem, itemData.title));

        this.globalState.selectorList.appendChild(listItem);
    }

    static deleteItem = (liElement, itemTitle) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {

                liElement.remove();
                this.globalState.listData = this.globalState.listData.filter(item => item.title !== itemTitle);
                StorageManager.saveData(this.globalState.listData);

                if (!this.globalState.listData.length) {
                    this.globalState.selectorList.innerHTML = "<h4 class='empty-state'> Seems You haven't added anything yet </h4>";
                }
                swal("Poof! Your imaginary file has been deleted!", {
                    icon: "success",
                });
            } else {
                swal("Your imaginary file is safe!");
            }
        });
    }

    static completeManager = (liElement, completeStatus) => {
        if (completeStatus) {
            liElement.classList.add('completed');
        } else {
            liElement.classList.remove('completed');
        }
    }

    static addListeners = () => {
        this.globalState.submitListItem.addEventListener('click', () => {
            let title = this.globalState.inputListItem.value;

            if (title) {
                this.globalState.listData.push({ title });
                StorageManager.saveData(this.globalState.listData);

                this.appendItem({ title });
                this.globalState.inputListItem.value = '';
            } else {
                this.globalState.inputListItem.classList.add('danger');
            }
        });

        this.globalState.inputListItem.addEventListener('keydown', () => {
            if (this.globalState.inputListItem.classList.contains('danger')) {
                this.globalState.inputListItem.classList.remove('danger');
            }
        })

        this.globalState.clearListItem.addEventListener('click', () => {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this imaginary file!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {

                    this.globalState.listData = [];
                    StorageManager.saveData(this.globalState.listData);

                    this.globalState.selectorList.innerHTML = "<h4 class='empty-state'> Seems You haven't added anything yet </h4>";
                    swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success",
                    });
                } else {
                    swal("Your imaginary file is safe!");
                }
            });
        })
    }

    static init = () => {
        let selectorList = document.getElementById('to-do-list-ul');
        let inputListItem = document.getElementById('to-do-input');
        let submitListItem = document.getElementById('to-do-add-btn');
        let clearListItem = document.getElementById('to-do-delete-all-btn');

        this.globalState = {
            ...this.globalState,
            selectorList,
            inputListItem,
            submitListItem,
            clearListItem
        }

        StorageManager.loadData();
        this.addListeners();
    }
}
