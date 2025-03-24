const arrFun = () => {
    console.log('I am Arrow function.')
}

let obj = {
    id: 12,
    name: 'Varun',
    role: 'ReactJS Expert'
}

const {id, name, role} = obj;

let str = `My name is ${this.name}.`;

let p1 = new Promise((res, rej) => {
    if(this.name === 'Varun'){ res('I am resolves') }
    else{ rej('I am rejected.') }
})

function fun(...props){
    console.log('My name is ' + props.name + ` & I am ${props.role}.`);
}

fun(obj);