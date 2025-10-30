const { faker } = require('@faker-js/faker');
const mysql =require('mysql2')
const express = require("express");
const app =express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));

app.set("view engine" , "ejs");
app.set("views", path.join(__dirname,"/views"));

const connection = mysql.createConnection({
    host: "localhost",
    user:"root",
    database: "delta_app",
    password: "root",
});



let getRandomUser = () => {
  return [
     faker.string.uuid(),
     faker.internet.username(),
     faker.internet.email(),
     faker.internet.password(),

  ];
}


app.get("/", (req,res) => {
    let q= `select count(*) from user`;
    try{
    connection.query(q, (err, result) => {
        if(err) throw err;
        let count = result[0]["count(*)"];
        res.render("home.ejs",{ count: count });
    });
} catch (err) {
    console.log(err);
    res.send("some err in databse");
}

});


// show Route
app.get("/user",(req, res) => {
    let q= `SELECT * FROM user`;

      try{
    connection.query(q, (err, users) => {
        if(err) throw err;
        // console.log(result);
        // res.send(result);
        res.render("showusers.ejs",{ users:users});
    });
} catch (err) {
    console.log(err);
    res.send("some err in databse");
}


});


//edit route
app.get("/user/:id/edit",(req,res) =>{
    let {id}=req.params;
    let q= `SELECT*FROM user WHERE id='${id}'`;


     try{
    connection.query(q, (err, result) => {
        if(err) throw err;
     
        let user = result[0];
        res.render("edit.ejs",{user:user});
    });
} catch (err) {
    console.log(err);
    res.send("some err in databse");
}
    
   
});


//UPDATE ROUTE
app.patch("/user/:id", (req,res) => {
    let {id}=req.params;
    let {  password: formPass, username: newUsername}=req.body;
    let q=`SELECT * FROM user WHERE id='${id}'`;

    try{
        connection.query(q,(err,result) =>{
            if(err) throw err;
            let user = result[0];

            console.log("Form password:", formPass);
            console.log("DB password:", user.password);

            if(formPass.trim() != user.password.trim()) {
                res.send("WRONG password");
            }else{
                let q2=`UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
                connection.query(q2,(err,result) =>{
                    if(err) throw err;
                    res.send(result);
                });
            }
        
        });
    }catch (err){
        console.log(err);
        res.send("some error in DB");
    }
  
});


app.listen("8080" , () => {
    console.log("server is listening to port 8080");
});







