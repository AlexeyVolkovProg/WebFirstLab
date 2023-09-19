let rValue;
let xValue;
let yValue;
let timeClient = new Date().getTimezoneOffset(); // Получаем смещение времени в минутах
const xButtonList = document.querySelectorAll(".x_button")
console.log(xButtonList)

function removeDuplicatesAndSetCurButton(xButtonList, button) {
    xButtonList.forEach((btn) => {
        btn.classList.remove("x-button-active")
    })
    button.classList.add("x-button-active")
    xValue = +button.textContent
    console.log(xValue)
}

xButtonList.forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault()
        removeDuplicatesAndSetCurButton(xButtonList, button)
    })
})

const rButtons = document.querySelectorAll('.r-radio')
rButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        rValue = +button.value
        console.log(rValue)
    })
})

const yField = document.querySelector("#selector_y");
console.log(yField)
yField.addEventListener('input', (event) => {
    yField.value = yField.value.replace(/[^-0-9.]/g, '').replace(/(\..*)\./g, '$1');
    yValue = yField.value
    console.log(yField.value)
})

function checkValueX() {
    if (xValue) {
        return true;
    } else {
        return false
    }
}

function checkValueY() {
    if (yValue) {
        return true;
    } else {
        return false
    }
}

function checkValueR() {
    if (rValue) {
        return true;
    } else {
        return false
    }
}

$(document).ready(function () {
    $(".user-form").on('submit', function (event) {
        event.preventDefault();
        console.log(xValue, yValue, rValue);
        if (checkValueX() && checkValueY() && checkValueR()) {
            const queryString = `x=${xValue}&y=${yValue}&r=${rValue}&timeClient=${timeClient}`;
            console.log(timeClient);
            const url = `server.php?${queryString}`;
            $.ajax({
                url: url,
                method: 'GET',
                success: function (response) {
                    document.querySelector(".table-results").innerHTML = "";
                    let results;
                    console.log(response);
                    try {
                        results = JSON.parse(response);
                    } catch (error) {
                        console.error("Ошибка при разборе JSON:", error);
                    }
                    const tableHeader = `
                            <tr>
                                <th>X</th>
                                <th>Y</th>
                                <th>R</th>
                                <th>Время запуска</th>
                                <th>Время работы</th>
                                <th>Результат</th>
                            </tr>
                        `;
                    document.querySelector(".table-results").insertAdjacentHTML('beforeend', tableHeader);
                    results.forEach(result => {
                        const row = `
                <tr>
                    <td>${result.x}</td>
                    <td>${result.y}</td>
                    <td>${result.r}</td>
                    <td>${result.formattedTime}</td>
                    <td>${result.time}</td>
                    <td>${result.res}</td>
                </tr>
            `;
                        document.querySelector(".table-results").insertAdjacentHTML('beforeend', row);

                    });
                }
            });
        }
    });
});