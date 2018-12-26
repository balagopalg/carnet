var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var {CarnetClient} = require('./CarnetClient') 

var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res){
    res.redirect("/blocky");
})

//Get home view
router.get('/blocky', function(req, res){
    res.render('blocky');
});

//Get login view
router.get('/login', function(req, res){
    res.render('login');
});

// Get vehiclelogin view
router.get('/regno',function(req, res){
    res.render('regno');
})

// Get Registration view
router.get('/reg',function(req, res){
    res.render('reg');
})

//Get Claim view
router.get('/claim',function(req, res){
    res.render('claim');
})


//Get Details View
router.get('/view', function(req, res){
    res.render('view');
})
 
//recieve data from Vehiclelogin page and save it.
router.post('/regno', urlencodedParser, function(req, res){
    var vehicleno = req.body.vehicleNo;
    res.send({done:1, vehicleNo: vehicleno, message: "User Successfully Logged into the registration/claim page of "+vehicleno  });
});

//function to save vehicle details in server
router.post('/reg', function(req, res) {
    var vehicleNo = req.body.vehicleNo;
    var claimNo = req.body.claimNo;
    var validity = req.body.validity;
    var carnetClient1 = new CarnetClient(vehicleNo); 
    carnetClient1.reg[vehicleNo,claimNo,validity];    
    res.send({message:"successfully added"});
});

//function to withdraw
router.post('/claim', function(req, res) {
    var claimNo = req.body.claimNo;
    var claimamount = req.body.amount;
    var date = req.body.date;
    var carnetClient1 = new CarnetClient(vehicleNo);   
    SimpleWalletClient1.claim[claimNo,amount,date];     
    res.send({message:"successfully added"});
});

//function to view details of vehicle
router.post('/details', function(req, res) {
    var vehicleNo = req.body.vehicleNo;
    var claimNo = req.body.claimNo;
    var claimamount = req.body.amount;
    var claimdate = req.body.date;
    var client = new CarnetClient(vehicleNo);
    var getYourDetails = client.details();
    console.log(getYourDetails);
    getYourBalance.then(result => {res.send({ balance: result, message:"Amount " + result + " available"});});
});

module.exports = router;