function showBalance() {
    $(".nav").find(".active").removeClass("active");
    $('#balance').addClass("active");    

    var vehicleNo = sessionStorage.getItem('vehicleNo');
    $.post('/details', { vehicleNo: vehicleNo},
         function (data, textStatus, jqXHR) {
              document.getElementById("balanceCheck").innerHTML =The details are: + "<br />" + data.details; 
            },
            'json'); 
}


