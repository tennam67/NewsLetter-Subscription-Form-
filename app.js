const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { STATUS_CODES } = require("http");
const { response } = require("express");

const app = express();

app.use(express.static("public"))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", (req, res)=>{
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    
    let data = {
        members: [
            {
                email_address: email,
                status:  "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us6.api.mailchimp.com/3.0/lists/a904dfb46f"
    const options = {
        method: "POST",
        auth: "tenzin:8c7e3fb439d582e24de3d2aa76532cb4-us6"
    }

    const request = https.request(url, options, (response)=>{
        response.statusCode === 200 ? res.sendFile(__dirname + "/success.html") : res.sendFile(__dirname + "/failure.html")
    })

    request.write(jsonData);
    request.end()

});

// trigger post request and redirects to home page

app.post("/failure", (req, res)=>{
    res.redirect("/")
})

app.listen(3000, ()=> {
    console.log("Your server is up and running on port 3000.")
});

// 8c7e3fb439d582e24de3d2aa76532cb4-us6


// a904dfb46f