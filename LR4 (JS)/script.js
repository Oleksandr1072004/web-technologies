// Task 1: Fruits Array
let fruits = ["apple", "banana", "cherry", "grape", "orange"];
let colors = ["red", "blue", "yellow", "green", "light blue", "dark blue"];
let employees = [
        { name: "John", age: 30, position: "developer" },
        { name: "Sarah", age: 25, position: "designer" },
        { name: "Mike", age: 35, position: "developer" }
    ];
let students = [
        { name: "Alexander", age: 20, course: 2 },
        { name: "Ivan", age: 22, course: 3 },
        { name: "Maria", age: 19, course: 1 }
    ];
let numbers = [1, 2, 3, 4, 5];
let books = [
            { title: "Book A", author: "Author X", genre: "Fiction", pages: 300, isAvailable: true },
            { title: "Book B", author: "Author Y", genre: "Science", pages: 150, isAvailable: false }
        ];
let student = { name: "Pavel", age: 21, course: 3 };

function fruitsArrayTasks() {

    fruits.pop();
    console.log("Task 1.1 - Updated Fruits Array:", fruits);
    fruits.unshift("pineapple");
    fruits.sort().reverse();
    console.log("Task 1.3 - Sorted Fruits Array:", fruits);
    console.log("Task 1.4 - Index of Apple:", fruits.indexOf("apple"));
}

// Task 2: Colors Array
function colorsArrayTasks() {

    let longest = colors.reduce((a, b) => (a.length > b.length ? a : b));
    let shortest = colors.reduce((a, b) => (a.length < b.length ? a : b));
    console.log("Task 2.2 - Longest & Shortest:", longest, shortest);
    colors = colors.filter(color => color.includes("blue"));
    console.log("Task 2.3 - Filtered Colors:", colors.join(", "));
}

// Task 3: Employees Array
function employeesArrayTasks() {

    employees.sort((a, b) => a.name.localeCompare(b.name));
    console.log("Task 3.2 - Sorted Employees:", employees);
    let developers = employees.filter(emp => emp.position === "developer");
    console.log("Task 3.3 - Developers:", developers);
    employees = employees.filter(emp => emp.age !== 30);
    employees.push({ name: "Anna", age: 28, position: "manager" });
    console.log("Task 3.5 - Updated Employees:", employees);
}

// Task 4: Students Array
function studentsArrayTasks() {

    students = students.filter(student => student.name !== "Maria");
    students.push({ name: "Nikolay", age: 21, course: 2 });
    students.sort((a, b) => b.age - a.age);
    console.log("Task 4.4 - Sorted Students:", students);
    console.log("Task 4.5 - Third Year Student:", students.find(student => student.course === 3));
}

// Task 5: Array Operations
function arrayOperations() {

    let squared = numbers.map(num => num * num);
    let evens = numbers.filter(num => num % 2 === 0);
    let sum = numbers.reduce((acc, num) => acc + num, 0);
    let newNumbers = numbers.concat([6, 7, 8, 9, 10]);
    newNumbers.splice(0, 3);
    console.log("Task 5 - Operations Result:", { squared, evens, sum, newNumbers });
}

// Task 6: Library Management
function libraryManagement() {
    let books = [
        { title: "Book A", author: "Author X", genre: "Fiction", pages: 300, isAvailable: true }
    ];

    return {
        addBook(title, author, genre, pages) {
            books.splice(1, 0, { title, author, genre, pages, isAvailable: true });
        },

        removeBook(title) {
            books = books.filter(book => book.title !== title);
        },

        findBooksByAuthor(author) {
            return books.filter(book => book.author === author);
        },

        toggleBookAvailability(title, isBorrowed) {
            let book = books.find(book => book.title === title);
            if (book) book.isAvailable = !isBorrowed;
        },

        sortBooksByPages() {
            books.sort((a, b) => a.pages - b.pages);
        },

        getBooksStatistics() {
            let total = books.length;
            let available = books.filter(book => book.isAvailable).length;
            let borrowed = total - available;
            let avgPages = books.reduce((sum, book) => sum + book.pages, 0) / total;
            return { total, available, borrowed, avgPages };
        },

        getAllBooks() {
            return books;
        }
    };
}

// Example usage:
function updateDisplay(){
    const library = libraryManagement();
    library.addBook("Book B", "Author Y", "Non-Fiction", 250);
    console.log("Books: ", library.getAllBooks());
    library.removeBook("Book A");
    console.log("Find book by author Y: ", library.findBooksByAuthor("Author Y"));
    library.toggleBookAvailability("Book B", true);
    library.sortBooksByPages();
    console.log("Get book statistics: ", library.getBooksStatistics());
    console.log("All books: ", library.getAllBooks());
}


// Task 7: Student Object
function studentObjectTasks() {

    student.subjects = ["Math", "Physics", "Programming"];
    delete student.age;
    console.log("Task 7 - Updated Student:", student);
}
document.getElementById("info_fruits").textContent = fruits.join(", ");
document.getElementById("info_colors").textContent = colors.join(", ");
document.getElementById("info_employees").textContent = JSON.stringify(employees, null, 2);
document.getElementById("info_students").textContent = JSON.stringify(students, null, 2);
document.getElementById("info_numbers").textContent = numbers.join(", ");
document.getElementById("info_books").textContent = JSON.stringify(books, null, 2);
document.getElementById("info_student").textContent = JSON.stringify(student, null, 2);
