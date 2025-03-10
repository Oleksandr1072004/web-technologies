// 1. Оператори порівняння

// Функція для знаходження максимального та мінімального значень у масиві
function findMinMax() {
    const array = document.getElementById('array_min_max').value;
        var res_array = document.getElementById('res_array');
    var lst = array.split(',');
    return {
        min: Math.min(...lst),
        max: Math.max(...lst)
    };
}

// Функція для порівняння двох об'єктів за їхніми властивостями
function compareObjects(obj1, obj2) {
    var res_compareObjects = document.getElementById('res_compareObjects');
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// 2. Логічні оператори

// Функція для перевірки, чи число знаходиться в певному діапазоні
function isInRange() {
    var res_isInRange = document.getElementById('res_isInRange');
    var min = document.getElementById("array_min").value;
    var num = document.getElementById("array_num").value;
    var max = document.getElementById("array_max").value;
    return num >= min && num <= max;
}

// Функція для зміни стану змінної
function toggleBoolean() {
    var res_toggleBoolean = document.getElementById('res_toggleBoolean');
    const value = document.getElementById('value_toggleBoolean').value;
    if (value == "true" || value == "false" || value == "True" || value == "False"){
        return !value;
    }
}

// 3. Умовні розгалуження

// Функція для переведення оцінки в словесний формат
function getGradeDescription() {
    var res_grade_num = document.getElementById('res_grade_num');
    var grade = document.getElementById('grade_num').value;
    if (grade >= 90) return "Відмінно";
    if (grade >= 75) return "Добре";
    if (grade >= 60) return "Задовільно";
    return "Незадовільно";
}

// Функція для визначення сезону за місяцем (if)
function getSeasonIf() {
    var res_month_if = document.getElementById('res_month_if');
    const month = document.getElementById('month_number_if').value;
    if (month >= 3 && month <= 5) return "Весна";
    if (month >= 6 && month <= 8) return "Літо";
    if (month >= 9 && month <= 11) return "Осінь";
    return "Зима";
}

// Функція для визначення сезону за місяцем (тернарний оператор)
function getSeasonTernary() {
    var res_month_ternary = document.getElementById('res_month_ternary');
    const month = document.getElementById('month_number').value;
    return (month >= 3 && month <= 5) ? "Весна" :
           (month >= 6 && month <= 8) ? "Літо" :
           (month >= 9 && month <= 11) ? "Осінь" : "Зима";
}

// Приклади використання
// console.log(findMinMax([4, 2, 9, 1, 5]));
// console.log(compareObjects({a: 1, b: 2}, {a: 1, b: 2}));
//console.log(isInRange(5, 1, 10));
//console.log(toggleBoolean(true));
//console.log(getGradeDescription(85));
//console.log(getSeasonIf(4));
//console.log(getSeasonTernary(11));
