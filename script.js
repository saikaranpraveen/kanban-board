const addBtn = document.querySelector(".add-btn");
const removeBtn = document.querySelector(".remove-btn");
const popUpElem = document.querySelector(".modal-cont");
const mainCont = document.querySelector(".main-cont");
const textArea = popUpElem.querySelector("textarea")
const allPriorityColors = popUpElem.querySelectorAll(".priority-color")
const allTickets = mainCont.querySelectorAll(".ticket-cont")

let popUpFlag = false;
let popUpPriorityColor = "black";
let removeFlag = false;

function createTicket(ticketColor, taskContent, ticketId) {
    const ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `<div class="${ticketColor} ticket-color"></div>
    <div class="ticket-id">${ticketId}</div>
    <div class="task-area">${taskContent}</div>
    <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
    </div>`;
    mainCont.appendChild(ticketCont);
    handleRemoval(ticketCont)
}

allTickets.forEach(function (ticket) {
    handleRemoval(ticket)
})

function handleRemoval(ticket) {
    ticket.addEventListener("click", () => {
        if (!removeFlag) {
            return;
        }else {
            ticket.remove();
        }
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

