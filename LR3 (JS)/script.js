function result_while(){
    const res = document.getElementById('res_while');
    let sum = 0, i = 1;
    while (i <= 50) {
        sum += i;
        i++;
    }
    console.log("Sum of first 50 natural numbers:", sum);
    return "Sum of first 50 natural numbers:" + sum;
}
function result_factorial_for(){
    const n = document.getElementById('num').value;
    const res = document.getElementById('res_factorial_for');
    let fact = 1;
    for (let i = 1; i <= n; i++) {
        fact *= i;
    }
    console.log(fact);
    return fact;
}
function result_month(){
    const number = document.getElementById('month_num').value;
    const res = document.getElementById('res_find_month');
    switch (parseInt(number)) {
                case 1: return "January";
                case 2: return "February";
                case 3: return "March";
                case 4: return "April";
                case 5: return "May";
                case 6: return "June";
                case 7: return "July";
                case 8: return "August";
                case 9: return "September";
                case 10: return "October";
                case 11: return "November";
                case 12: return "December";
                default: return "Invalid month number";
            }
}
function result_for(){
    const array = document.getElementById('array').value;
    var lst = array.split(',');
    console.log(array);
    const even_num = []
    for (var i = 0; i < lst.length; i++){
        if (lst[i] % 2 == 0){
            even_num.push(lst[i])
        }
    }
    const res = document.getElementById('res_array');
    alert(even_num);
    return even_num
}
function result_vowel(){
    const word = document.getElementById('word').value;
    const countVowels = str => (str.match(/[aeiouAEIOU]/g) || []).length;
    const res = document.getElementById('res_word');
    alert(countVowels(word));
    return countVowels(word)
}
function result_power(){
    const base = document.getElementById('base').value;
    const exponent = document.getElementById('exponent').value;
    const res = document.getElementById('res_power');
    console.log("Result of task 6: " + Math.pow(base, exponent))
    return Math.pow(base, exponent);
}
