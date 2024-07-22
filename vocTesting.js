let tableData;
let submit = document.getElementById("submit");
let randomIndices;
let doneShowingIncorrectLine = false;

document.addEventListener("DOMContentLoaded", function () {
    let storedTableData = localStorage.getItem("tableData");
    if (storedTableData) {
        tableData = JSON.parse(storedTableData);
        randomIndices = getRandomIndices(tableData.length, numOfQ);
        testing();
    }
    submit.addEventListener("click", function () {
        if (!doneShowingIncorrectLine) {
            checkAnswer();
            doneShowingIncorrectLine = true;
            finishingPage();
        }
    });
    
});

function getRandomIndices(length, num) {
    let indices = [];
    while (indices.length < num) {
        let randIndex = Math.floor(Math.random() * length);
        if (!indices.includes(randIndex)) {
            indices.push(randIndex);
        }
    }
    return indices;
}

let numOfQ = Number(sessionStorage.getItem("selectedOption"));
let rows = [];
let testingTable = document.getElementById("testingTable");

function testing() {
    if (tableData) {  
        rows = [];
        numOfQ = Math.min(numOfQ, tableData.length);
          
        for (let i = 0; i < numOfQ; i++) {
            const question = tableData[randomIndices[i]];
            const showYomigana = question.yomigana && Math.random() < 0.5;
            const row = createTableRow(i + 1, question, showYomigana);
            testingTable.appendChild(row);
            rows.push(row);
        }
    }
    changingFocus(numOfQ);
    centerTheInput();
}

function createTableRow(index, question, showYomigana) {
    const row = document.createElement("tr");
    for (let j = 0; j < 4; j++) {
        const cell = document.createElement("td");
        setTableCellContent(cell, j, index, question, showYomigana);
        row.appendChild(cell);
    }
    return row;
}

function setTableCellContent(cell, columnIndex, index, question, showYomigana) {
    switch (columnIndex) {
        case 0:
            cell.textContent = `${index}.`;
            cell.style.fontSize = "20px";
            break;
        case 1:
            cell.innerHTML = `
                <div> 
                    <label for="vocInput${index}"><input id="vocInput${index}" class="vocInput" autocomplete="off"></label>
                </div>
            `
            break;
        case 2:
            if (showYomigana) {
                cell.textContent = question.yomigana;
            } else if (!question.yomigana) {
                cell.textContent = "";
            } else {
                cell.innerHTML = `
                    <div> 
                        <label for="yomiganaInput${index}"><input id="yomiganaInput${index}" class="yomiganaInput" autocomplete="off"></label>
                    </div>
                `
            }
            break;
        case 3:
            if (!showYomigana || !question.yomigana) {
                cell.textContent = question.meaning;
            } else {
                cell.innerHTML = `
                <div> 
                    <label for="meaningInput${index}"><input id="meaningInput${index}" class="meaningInput" autocomplete="off"></label>
                </div>
            `
            }
            break;
    }
}
function changingFocus (numOfQ) {
    for (let i = 1; i <= numOfQ; i++) {
        let vocInput = document.getElementById(`vocInput${i}`);
        let yomiganaInput = document.getElementById(`yomiganaInput${i}`);
        let meaningInput = document.getElementById(`meaningInput${i}`);
        vocInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                setTimeout(() => {
                    if (yomiganaInput) {
                        yomiganaInput.focus();
                    } else if (meaningInput) {
                        meaningInput.focus();
                    }
                    else {
                        document.getElementById(`vocInput${i + 1}`).focus();
                    }
                }, 100);
            }
        });
        if (yomiganaInput) {
            yomiganaInput.addEventListener("keyup", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    setTimeout(() => {
                        document.getElementById(`vocInput${i + 1}`).focus();
                    }, 100);
                }
            });
        }
        if (meaningInput) {
            meaningInput.addEventListener("keyup", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    setTimeout(() => {
                        document.getElementById(`vocInput${i + 1}`).focus();
                    }, 100);
                }
            });
        }
    }
}   

function centerTheInput () {
    const inputs = document.querySelectorAll("input");
    let timer;

    inputs.forEach(input => { 
        input.addEventListener("keyup", function(event) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    this.classList.add("centered");
                    this.blur();
                }
            }, 100);
        })

        input.addEventListener("focus", function() {
            if (this.value.trim() === "") {
                this.classList.remove("centered");
            }
        });
    })

    document.addEventListener("click", function(event) {
        inputs.forEach(input => {
            if (event.target !== input && input.value.trim() !== "") {
                input.classList.add("centered");
                input.blur();
            }
        });
    });
}

let checkedVoc = [];
let checkedYomigana = [];
let checkedMeaning = [];
let finalScore;

function scoreCounting () {  
    let inputs = document.querySelectorAll("input");
    let scoreOfEachInput = Math.round(100 / inputs.length);
    
    function countFalseValues(arr) {
        return arr.filter(value => value === false).length;
    }
    let arrays = [checkedVoc, checkedYomigana, checkedMeaning];
    let falseCounts = arrays.reduce((total, arr) => total + countFalseValues(arr), 0);
    finalScore = 100 - (scoreOfEachInput * falseCounts);

    if (Array.from(inputs).every(input => input.value === "")) {
        finalScore = 0;
    } else if (finalScore < 0) {
        finalScore = 0;
    }

    console.log("Final Score:", finalScore);  
}

function checkAnswer () {
    checkedVoc = [];
    checkedYomigana = [];
    checkedMeaning = [];

    for (let i = 1; i <= numOfQ; i++) {  
        let vocInput = document.getElementById(`vocInput${i}`);
        let yomiganaInput = document.getElementById(`yomiganaInput${i}`);
        let meaningInput = document.getElementById(`meaningInput${i}`);

        if (vocInput) {
            let tOrF = vocInput.value === tableData[randomIndices[i-1]].voc;
            checkedVoc.push(tOrF);
        }else {
            checkedVoc.push(null);
        }
        if (yomiganaInput) {
            let tOrF = yomiganaInput.value === tableData[randomIndices[i-1]].yomigana;
            checkedYomigana.push(tOrF);
        }else {
            checkedYomigana.push(null);
        }
        if (meaningInput) {
            let tOrF = meaningInput.value === tableData[randomIndices[i-1]].meaning;
            checkedMeaning.push(tOrF);
        }else {
            checkedMeaning.push(null);
        }

        if ((checkedVoc[i-1] !== false) && (checkedYomigana[i-1] !== false) && (checkedMeaning[i-1] !== false)) {
            console.log(`Line${i} is all correct!`);
        }
        else {
            showIncorrectLine(checkedVoc[i-1], checkedYomigana[i-1], checkedMeaning[i-1], vocInput, yomiganaInput, meaningInput, i);
        }
    }
    scoreCounting();
}

function showIncorrectLine (vocTOrF, yomiganaTOrF, meaningTOrF, vocInput, yomiganaInput, meaningInput, i) {
    let correctingTable = document.getElementById("correcting");
    const row = document.createElement("tr");
    for (let j = 0; j < 3; j++) {
        const cell = document.createElement("td");
        if (j === 0) {
            cell.textContent = vocTOrF !== false ? tableData[randomIndices[i-1]].voc : vocInput.value;
            if (vocTOrF === false) {
                cell.textContent = vocInput.value ? vocInput.value : "________";
                cell.style.color = "red";    
            }
        } else if (j === 1) {
            cell.textContent = yomiganaTOrF !== false ? tableData[randomIndices[i-1]].yomigana : (yomiganaInput ? yomiganaInput.value : "");
            if (yomiganaTOrF === false) {
                cell.textContent = yomiganaInput.value ? yomiganaInput.value : "________"
                cell.style.color = "red";
            }
        } else if (j === 2) {
            cell.textContent = meaningTOrF !== false ? tableData[randomIndices[i-1]].meaning : (meaningInput ? meaningInput.value : "");
            if (meaningTOrF === false) {
                cell.textContent = meaningInput.value ? meaningInput.value : "________";
                cell.style.color = "red";
            }
        }
        row.appendChild(cell);
    }
    correctingTable.appendChild(row);
}

function finishingPage () {
    let finishDiv = document.getElementById("finish");
    let backBtn = document.getElementById("back");
    backBtn.style.display = "inline";
    backBtn.addEventListener("click", function () {
        window.location.href = "vocReciter.html"
    });

    testingTable.classList.add("hidden");
    submit.classList.add("hidden");

    let showingScore = document.createElement("h2");
    showingScore.textContent = "您的成績： ";

    let scoreSpan = document.createElement("span");
    scoreSpan.textContent = `${finalScore}`;
    scoreSpan.style.color = "red";

    let slash100 = document.createElement("span");
    slash100.textContent = "/100";

    showingScore.appendChild(scoreSpan);
    showingScore.appendChild(slash100);

    let title = document.createElement("h3");
    title.textContent = "答錯的題目：";

    finishDiv.appendChild(showingScore);
    finishDiv.appendChild(title);
        
}