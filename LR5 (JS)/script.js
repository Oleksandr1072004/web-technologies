let states = ["red", "yellow", "green", "flashing-yellow"];
let index = 0;

function changeLight() {
    document.querySelectorAll(".light").forEach(light => light.classList.remove("red", "yellow", "green"));
    document.getElementById(states[index]).classList.add(states[index]);
    index = (index + 1) % states.length;
}
setInterval(changeLight, 5000);
function updateClock() {
    document.getElementById("clock").innerText = new Date().toLocaleTimeString();
}
setInterval(updateClock, 1000);
let timeout;
function toggleLight() {
    const bulb = document.getElementById("bulb");
    bulb.classList.toggle("on");
    resetAutoOff();
}

function changeBulbType() {
    const type = document.getElementById("bulbType").value;
    alert("Selected: " + type);
}

function setBrightness() {
    let brightness = prompt("Enter brightness level (1-100):");
    if (brightness) {
        alert("Brightness set to: " + brightness);
    }
}

function resetAutoOff() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        document.getElementById("bulb").classList.remove("on");
    }, 300000);
}

let productCatalog = new Map();
function addProduct(id, name, price, quantity) {
    productCatalog.set(id, { name, price, quantity });
}

function removeProduct(id) {
    productCatalog.delete(id);
}

function updateProduct(id, newPrice, newQuantity) {
    if (productCatalog.has(id)) {
        let product = productCatalog.get(id);
        product.price = newPrice;
        product.quantity = newQuantity;
    }
}

function searchProduct(name) {
    for (let [id, product] of productCatalog) {
        if (product.name === name) return product;
    }
    return null;
}

function orderProduct(id, quantity) {
    if (productCatalog.has(id)) {
        let product = productCatalog.get(id);
        if (product.quantity >= quantity) {
            product.quantity -= quantity;
            console.log("Order placed.");
        } else {
            console.log("Insufficient stock.");
        }
    }
}