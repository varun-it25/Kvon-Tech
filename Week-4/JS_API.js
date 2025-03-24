// Simple GET Request
async function callApi_1(url){
    await fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data)
    }
)
}

// GET Request with method
async function callApi_2(url){
    await fetch(url, {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
    }
)
}

// POST Request with body
async function callApi_3(url){
    await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ 
            username: 'Tanu.Kvon',
            password: '12345678',
        })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
      }
    )
}

callApi_1(`https://api.restful-api.dev/objects`)