const vocContainer = document.getElementById("voc");
const yomiganaContainer = document.getElementById("spelling");
const meaningContainer = document.getElementById("meaning");
const submitButton = document.querySelector("#submit");
const list = document.getElementById("list");
const editBtn = document.getElementById("editTheList");
const startBtn  = document.getElementById("start");
const confirmBtn = document.getElementById("confirm");
const modal = document.getElementById("myModal");

vocContainer.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        yomiganaContainer.focus();
    }
});

yomiganaContainer.addEventListener("keypress",function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        meaningContainer.focus();
    }
});

meaningContainer.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        meaningContainer.blur();
        if (!isEditingMode) {
            checkIfInputOk();
        }else if (isEditingMode) {
            alert("請先完成編輯！");
            editBtn.addEventListener("click", () => {meaningContainer.focus();});
        }  
    }
});

startBtn.onclick = function() {
    modal.style.display = "block";
}

document.getElementsByClassName('close')[0].onclick = function() {
    document.getElementById('myModal').style.display = "none";
}

window.onclick = function(event) {
    if (event.target == document.getElementById('myModal')) {
        document.getElementById('myModal').style.display = "none";
    }
}

function submitForm() {
    const rows = document.querySelectorAll("#list .aRowOfList");
    const form = document.getElementById('optionsForm');
    const selectedOption = form.querySelector('input[name="options"]:checked');
    if (!selectedOption) {
        alert("請選擇考題數目！");
        return;
    } else if (selectedOption.value > rows.length) {
        alert("單字表數目不足！");
        return;
    } else {
        sessionStorage.setItem("selectedOption", selectedOption.value);
        window.location.href = "vocTesting.html";
    }
}
confirmBtn.addEventListener("click", submitForm)

let rowCount = 1;
let isEditingMode = false;

const loadTable = () => {
    const tableData = JSON.parse(localStorage.getItem("tableData")) || [];
    tableData.forEach(row => {
        addRow(row.voc, row.yomigana, row.meaning);
    });
};

const saveTable = () => {
    const rows = document.querySelectorAll("#list .aRowOfList");
    const tableData = Array.from(rows).map(row => {
        const cells = row.getElementsByTagName("td");
        return {
            voc: cells[0].innerText,
            yomigana: cells[1].innerText,
            meaning: cells[2].innerText
        };
    });
    localStorage.setItem("tableData", JSON.stringify(tableData));
};


function showAddedOrDeletedAlert(message, duration) {
    const addedOrDeletedAlert = document.getElementById("addedOrDeletedAlert");
    addedOrDeletedAlert.textContent = message;
    addedOrDeletedAlert.style.opacity = 0.8;
    addedOrDeletedAlert.style.display = 'block';

    setTimeout(() => {
        addedOrDeletedAlert.style.opacity = 0;
        setTimeout(() => {
            addedOrDeletedAlert.style.display = 'none';
        }, 500);
    }, duration);
}

const addRow = (voc, yomigana, meaning) => {
    const newRow = list.insertRow();
    newRow.className = "aRowOfList";
    newRow.innerHTML = `
        <td>${voc}</td>
        <td>${yomigana}</td>
        <td>${meaning}</td>
    `;
    showAddedOrDeletedAlert(`已成功新增 “${voc}” 到單字表！`, 1500);
};


const checkIfInputOk = () => {
    if (!vocContainer.value.trim() && !meaningContainer.value.trim()) {
        alert("請輸入日文單字及意思！");
    } else if (!meaningContainer.value.trim()) {
        alert("請輸入意思！");
    } else if (!vocContainer.value.trim()) {
        alert("請輸入日文單字！");
    } else {
        rowCount++;
        addRow(vocContainer.value, yomiganaContainer.value, meaningContainer.value);
        saveTable();
        vocContainer.value = "";
        yomiganaContainer.value = "";
        meaningContainer.value = "";
        vocContainer.focus();
    }
};

submitButton.addEventListener("click", checkIfInputOk);

const toggleEditMode = () => { 
    const rows = document.querySelectorAll("#list .aRowOfList");
    if (editBtn.innerText === "編輯單字表") {
        rows.forEach(row => {
            if (!row.querySelector(".deleteCell")) {
                let cell = row.insertCell(-1);
                cell.classList.add("deleteCell");
                cell.innerHTML = '<button class="deleteBtn">刪除</button>';
                const deleteBtn = cell.querySelector(".deleteBtn");
                deleteBtn.addEventListener("click", () => {
                    const voc = row.cells[0].textContent;
                    let doubleCheck = () => {
                        let ans = confirm(`確定要刪除 “${voc}” 嗎？`);
                        if (ans) {
                            row.remove();
                            saveTable();
                            showAddedOrDeletedAlert(`已從單字表刪除 “${voc}” !`, 1500);
                        }else {return}
                    }
                    doubleCheck();
                });
            }
        });
        isEditingMode = true;
        editBtn.innerText = "完成編輯";
        submitButton.disabled = true;
        startBtn.onclick = () => {
            alert("請先完成編輯！");
        }   
    } else {
        rows.forEach(row => {
            let deleteCell = row.querySelector(".deleteCell");
            if (deleteCell) {
                deleteCell.remove();
            }
        });
        editBtn.innerText = "編輯單字表";
        isEditingMode = false;
        submitButton.disabled = false;
        startBtn.onclick = function() {
            modal.style.display = "block";
        }
    }
};

editBtn.addEventListener("click", toggleEditMode);
window.onload = () => {
    loadTable();

    const addedOrDeletedAlert = document.getElementById("addedOrDeletedAlert");
    addedOrDeletedAlert.style.display = 'none'; 
    addedOrDeletedAlert.textContent = '';
    addedOrDeletedAlert.style.opacity = 0; 
};


