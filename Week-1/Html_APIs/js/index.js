let worker;

function getLocation() {
    navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        if (!worker) {
            worker = new Worker('js/worker.js');
            worker.postMessage({ latitude, longitude });

            worker.onmessage = function(e) {
                const weatherData = e.data;
                const weatherDiv = document.getElementById('weather-info');
                weatherDiv.innerHTML = `
                    <p class="data">Location: ${weatherData.city}</p>
                    <p class="data">Temperature: ${weatherData.temp}°C</p>
                    <p class="data">Condition: ${weatherData.condition}</p>
                `;
            };
        } else {
            worker.postMessage({ latitude, longitude });
        }
    });
}

getLocation();

const end = document.getElementById("end");
const status = document.getElementById("status");
 
end.onclick = function() {
    if (worker) {
        worker.terminate();
        worker = null;
        console.log("Worker terminated");
        end.innerHTML = "Ending..."
        setTimeout(()=>{
            end.style.display = "none";
            status.innerHTML = "Now, worker is ended.This is the last latest update.";
        },1000)
    }
};

let key = localStorage.getItem("key");

let input = document.getElementById("value")
let kInput = document.getElementById("key")
const setter = document.getElementById("setter");
const stStatus = document.getElementById("st-status");

if(key){
    input.value = key
} else{
    input.placeholder = "Empty"
}

setter.addEventListener('click', (e) => {
    localStorage.setItem("key", input.value);
    setTimeout(()=>{
        stStatus.innerHTML = "Values set successfully."
    },1000)
    setTimeout(()=>{
        stStatus.innerHTML = "This value are stored in local storage."
    },2000)
})