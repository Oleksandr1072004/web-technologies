// 1. Цифровий годинник з анімацією секунд
function updateClock() {
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, "0");
    let minutes = now.getMinutes().toString().padStart(2, "0");
    let seconds = now.getSeconds().toString().padStart(2, "0");

    document.getElementById("clock").innerHTML =
        `${hours}:${minutes}:<span class="blinking">${seconds}</span>`;
}
setInterval(updateClock, 1000);
updateClock();

// 2. Таймер зворотного відліку
let countdownInterval;
function startCountdown() {
    clearInterval(countdownInterval);
    let endTime = new Date(document.getElementById("timerInput").value);

    countdownInterval = setInterval(() => {
        let now = new Date();
        let diff = endTime - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            document.getElementById("countdown").innerHTML = "Час вийшов!";
            return;
        }

        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor((diff / (1000 * 60)) % 60);
        let seconds = Math.floor((diff / 1000) % 60);

        document.getElementById("countdown").innerHTML =
            `${days} дн. ${hours} год. ${minutes} хв. ${seconds} сек.`;
    }, 1000);
}

// 3. Календар
function generateCalendar() {
    let calendarTable = document.getElementById("calendarTable");
    calendarTable.innerHTML = ""; // Очищуємо старий календар

    let date = new Date(document.getElementById("calendarInput").value + "-01");
    let year = date.getFullYear();
    let month = date.getMonth();

    let firstDay = new Date(year, month, 1).getDay();
    let lastDate = new Date(year, month + 1, 0).getDate();

    let weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
    let row = "<tr>" + weekdays.map(d => `<th>${d}</th>`).join("") + "</tr>";

    let cells = [];
    for (let i = 0; i < firstDay - 1; i++) cells.push("<td></td>");
    for (let d = 1; d <= lastDate; d++) cells.push(`<td>${d}</td>`);

    while (cells.length % 7 !== 0) cells.push("<td></td>");

    for (let i = 0; i < cells.length; i += 7) {
        row += "<tr>" + cells.slice(i, i + 7).join("") + "</tr>";
    }

    calendarTable.innerHTML = row;
}
document.getElementById("calendarInput").value = new Date().toISOString().slice(0, 7);
generateCalendar();

// 4. Час до дня народження
function calculateBirthdayCountdown() {
    let birthday = new Date(document.getElementById("birthdayInput").value);
    let now = new Date();

    // Встановлення дати народження на поточний рік
    birthday.setFullYear(now.getFullYear());
    if (birthday < now) {
        birthday.setFullYear(now.getFullYear() + 1); // Якщо день народження вже минув, беремо наступний рік
    }

    let diff = birthday - now;
    let months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    let days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 30);
    let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((diff / (1000 * 60)) % 60);
    let seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("birthdayCountdown").innerHTML =
        `До вашого дня народження залишилось: ${months} міс., ${days} дн., ${hours} год., ${minutes} хв., ${seconds} сек.`;
}
