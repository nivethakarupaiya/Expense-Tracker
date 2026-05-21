//VARIABLES  
let transactions=JSON.parse(localStorage.getItem("transactions")) || [];
let currentType="income";

//SET TYPE
function setType(type){
    currentType=type;
}

//ADD TRANSACTIONS 
function addTransactions() {
    const description=document.getElementById("description").value.trim();
    const amount=parseFloat(document.getElementById("amount").value);
    const category=document.getElementById("category").value;


//VALIDATION
if(description===""){
    alert("please enter the description")
    return;
}
if(isNaN(amount)){
    alert("please enter an valid number")
    return;
}
if(amount<=0){
    alert("please enter the number greater than 0")
    return;
}

//CREATE TRANSACTION OBJECT

const transaction= {
    id: Date.now(),
    description: description,
    amount: amount,
    category: category,
    type:currentType,
    date:new Date()
};


//PUSH TO ARRAY
transactions.push(transaction);

//SAVED TO LOCAL STORAGE
localStorage.setItem("transactions",JSON.stringify(transactions));

//CLEAR INPUTS
document.getElementById("description").value="";
document.getElementById("amount").value="";

//RENDER 
renderTransactions();
}

//DELETE TRANSACTIONS

function deleteTransactions(id){

transactions=transactions.filter(
    t => t.id !==id
);
localStorage.setItem("transactions",JSON.stringify(transactions));
 
renderTransactions();

}
// UPDATE SUMMARY
function updateSummary (){
const totalIncome=
transactions
       .filter(t => t.type=="income")
       .reduce((sum, t) => sum + t.amount, 0);
const totalExpense=
transactions
       .filter(t => t.type=="expense")
       .reduce((sum, t) => sum + t.amount, 0);
    
const balance= totalIncome - totalExpense;

document.getElementById("balance").innerHTML="₹" + balance.toFixed(2);
document.getElementById("total-income").innerHTML="₹" + totalIncome.toFixed(2);
document.getElementById("total-expense").innerHTML="₹" + totalExpense.toFixed(2);
}

//RENDER TRANSACTIONS
 
function renderTransactions() {
    const searchText=document.getElementById("search").value.toLowerCase();
    const filterCategory=document.getElementById("filter-category").value;
    const list=document.getElementById("tx-list");
    const emptyMsg=document.getElementById("empty-msg");
//FILTER 
let filtered= transactions.filter ( t=> {
     const matchesSearch = t.description.toLowerCase().includes(searchText);
     const matchesCategory = filterCategory ==="All" ||
     t.category === filterCategory;
     return (
        matchesSearch &&  matchesCategory
     );
});

// CLEAR OLD LIST
list.innerHTML="";

// EMPTY MESSAGE
if(filtered.length ===  0){
    emptyMsg.style.display="block";
}
else {
    emptyMsg.style.display="none";
}

//SHOW TRANSACTIONS
filtered
.slice()
.reverse()
.forEach(t => {
    const li=document.createElement("li");
    li.className="tx-item";
    const sign= t.type === "income" ? "+":"-";
    li.innerHTML = `
    <div class="tx-info">
    <div class="tx-desc">
                    ${t.description}
                </div>

                <div class="tx-meta">
                    ${t.category}
                </div>

            </div>

            <div class="tx-amount ${t.type}">
                ${sign}₹${t.amount.toFixed(2)}
            </div>

            <button
                class="delete-btn"
                onclick="deleteTransactions(${t.id})"
            >
                Delete
            </button>
            `;
            list.appendChild(li);

    });

    updateSummary();
}

//INTIAL LOAD

renderTransactions();

// SEARCH EVENT
document
.getElementById("search")
.addEventListener(
    "input",
    renderTransactions
);

// FILTER EVENT
document
.getElementById("filter-category")
.addEventListener(
    "change",
    renderTransactions
);

