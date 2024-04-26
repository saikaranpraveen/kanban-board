const addBtn = document.querySelector(".add-btn");
const removeBtn = document.querySelector(".remove-btn");
const popUpElem = document.querySelector(".modal-cont");
const mainCont = document.querySelector(".main-cont");
const textArea = popUpElem.querySelector("textarea")
const allPriorityColors = popUpElem.querySelectorAll(".priority-color")
const allTickets = mainCont.querySelectorAll(".ticket-cont")
const toolBoxColors = document.querySelectorAll(".color")
const ticketsArr = JSON.parse(localStorage.getItem('tickets')) || [];
const lockClose = "fa-lock";
const lockOpen = "fa-lock-open";
const colors = ["lightpink", "lightgreen", "lightblue", "black"]

let popUpFlag = false;
let popUpPriorityColor = "black";
let removeFlag = false;

function init() {
    if (localStorage.getItem("tickets")) {
        ticketsArr.forEach(function (ticket) {
            createTicket(ticket.ticketColor, ticket.taskContent,
                ticket.ticketId);
        });
    }
}
init();

toolBoxColors.forEach(function (colorElem) {
    colorElem.addEventListener("click", function () {
        const allTickets = document.querySelectorAll(".ticket-cont"); // []
        const selectedColor = colorElem.classList[0];
        allTickets.forEach(function (ticket) {
            const ticketColorband = ticket.querySelector(".ticket-color");
            if (ticketColorband.style.backgroundColor == selectedColor) {
                ticket.style.display = "block";
            } else {
                ticket.style.display = "none";
            }
        });
    });
    colorElem.addEventListener("dblclick", function () {
        const allTickets = document.querySelectorAll(".ticket-cont");
        allTickets.forEach(function (ticket) {
            ticket.style.display = "block";
        });
    });
});

function handleColor(ticket) {
    const ticketColorElem = ticket.querySelector(".ticket-color")
    const id = ticket.querySelector(".ticket-id").innerText;
    
    ticketColorElem.addEventListener("click", () => {
        let currentColor = ticketColorElem.style.backgroundColor;
        let currentColorIdx = colors.findIndex((color) => color === currentColor);
        const ticketIdx = getTicketIdx(id);
        let newColorIdx = currentColorIdx + 1;
        if (newColorIdx > colors.length - 1) {
            newColorIdx = newColorIdx % colors.length;
        }
        ticketColorElem.style.backgroundColor = colors[newColorIdx];
        ticketsArr[ticketIdx].ticketColor = colors[newColorIdx];
        updateLocalStorage();
    })
}

function createTicket(ticketColor, taskContent, ticketId) {
    const ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `<div class="ticket-color" style="background-color:${ticketColor}"></div>
    <div class="ticket-id">${ticketId}</div>
    <div class="task-area">${taskContent}</div>
    <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>    
    </div>`;
    mainCont.appendChild(ticketCont);
    handleRemoval(ticketCont);
    handleLock(ticketCont);
    handleColor(ticketCont);
}

allTickets.forEach(function (ticket) {
    handleRemoval(ticket)
})

function handleRemoval(ticket) {
    ticket.addEventListener("click", () => {
        const id = ticket.querySelector(".ticket-id").innerText;
        if (!removeFlag) {
            return;
        } else {
            ticket.remove();
            const ticketIdx = getTicketIdx(id);
            ticketsArr.splice(ticketIdx, 1);
            updateLocalStorage();
        }
    })
}

function updateLocalStorage() {
    localStorage.setItem("tickets",
        JSON.stringify(ticketsArr));
}

function getTicketIdx(id) {
    let ticketIdx = ticketsArr.findIndex(function (ticketObj) {
        return ticketObj.ticketId === id;
    });
    return ticketIdx;
}

function handleLock(ticket) {
    const ticketLockElem = ticket.querySelector(".ticket-lock");
    const ticketLockIcon = ticketLockElem.children[0];
    const ticketTaskArea = ticket.querySelector(".task-area");
    const id = ticket.querySelector(".ticket-id").innerText;
    const ticketIdx = getTicketIdx(id);

    ticketLockIcon.addEventListener("click", () => {
        if (ticketLockIcon.classList.contains(lockClose)) {
            ticketLockIcon.classList.remove(lockClose);
            ticketLockIcon.classList.add(lockOpen);
            ticketTaskArea.setAttribute("contenteditable", "true");
        } else {
            ticketLockIcon.classList.remove(lockOpen);
            ticketLockIcon.classList.add(lockClose);
            ticketTaskArea.setAttribute("contenteditable", "false");
        }
        ticketsArr[ticketIdx].taskContent = ticketTaskArea.innerText;
        updateLocalStorage();
    })
}

addBtn.addEventListener("click", () => {
    if (popUpFlag === false) {
        popUpElem.style.display = "flex";
        popUpFlag = true;
    } else {
        popUpElem.style.display = "none";
        popUpFlag = false;
    }
})

popUpElem.addEventListener("keydown", (event) => {
    if (event.key === "Shift") {
        const taskContent = textArea.value;
        const ticketId = shortid()
        createTicket(popUpPriorityColor, taskContent, ticketId);
        popUpElem.style.display = "none";
        textArea.value = "";
        popUpFlag = false;
        ticketsArr.push({ ticketId, taskContent, ticketColor: popUpPriorityColor });
        updateLocalStorage();
    }
})

allPriorityColors.forEach(function (colorElem) {
    colorElem.addEventListener("click", () => {
        allPriorityColors.forEach(function (cElem) {
            cElem.classList.remove("active");
        })
        colorElem.classList.add("active");
        popUpPriorityColor = colorElem.classList[0];

    })
})

removeBtn.addEventListener("click", () => {
    removeFlag = !removeFlag;
    if (removeFlag) {
        alert("Delete mode is activated!");
        removeBtn.style.color = "red";
    } else {
        removeBtn.style.color = "white";
    }
})

// localStorage.setItem('user', JSON.stringify({ name:
//     'Alice', age: 30 }));
