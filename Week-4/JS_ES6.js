// Arrow Function
const arrFun = () => {
    console.log('I am Arrow function.')
}

let arr = [1,2];

let obj = {
    id: 12,
    name: 'Varun',
    role: 'ReactJS Expert'
}

// Destucture of Object
const {id, name, role} = obj;

// Destucture of Array
const [one, two] = arr;

// Template Literal
let str = `My name is ${this.name}.`;

// Promises
let p1 = new Promise((res, rej) => {
    if(this.name === 'Varun'){ res('I am resolves') }
    else{ rej('I am rejected.') }
})

// Rest Opertaor
function fun(...props){
    console.log('My name is ' + props.name + ` & I am ${props.role}.`);
}

fun(obj);