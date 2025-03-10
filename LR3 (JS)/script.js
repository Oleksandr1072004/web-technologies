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