function fun1(a, b){
    let sum = a+b;
    console.log(`Result of fun1 is ${sum}`)
}
fun1(2,1);

let fun2 = (a, b) => {
    let sub = a - b;
    console.log(`Result of fun2 is ${sub}`)
}
fun2(2,1);

(function(){
    console.log(`I am Self Invoked Function. I will run without calling me.`)
})()