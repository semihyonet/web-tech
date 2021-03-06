//task 1
//source: https://www.w3schools.com/howto/howto_js_sort_table.asp

const apiUrl = "http://localhost:3000"



function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("table");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

// This function is used to fetch all data from the server and dynamicaly modify our table
const getAllItems = () => {
  $.ajax({
    method: "GET",
    url: apiUrl,
    dataType: "json"
  }).done(function (data) {
    // After we fetch our data we start DOM Manipulation
    var content = `
    <table id="table">
    <caption id="caption">Product List</caption>
    <tr id="content">
        <th>Image</th>
        <th onclick="sortTable(1)">Brand</th>
        <th onclick="sortTable(2)">Model</th>
        <th onclick="sortTable(3)">OS</th>
        <th onclick="sortTable(4)">Screensize</th>
        <th>Operations</th>
    </tr>`;
    for (var i = 0; i < data.length; ++i) {
      content += "<tr>";
      content += `<td><img alt=picture height=150 src='${data[i].image}'/></td>`;
      content += "<td>" + data[i].brand + "</td>";
      content += "<td>" + data[i].model + "</td>";
      content += "<td>" + data[i].os + "</td>";
      content += "<td>" + data[i].screensize + "</td>";
      content += `<td> <button onclick="deleteItem(${data[i].id})">Delete</button> </td>`; // We inject onclick function
      content += "</tr>";
    }
    content += "</table>"
    $("#table").replaceWith(content);
     // Instead of appending we are replacing all our data and creating the table from start each time we render this function
  });
}

// This function is called from the table rows to delete specific Items
function deleteItem(itemId){
  $.ajax({
    method: "DELETE",
    url: apiUrl+`/${itemId}`,
    dataType: "json"
  }).done(function (data) {
    getAllItems() // To refresh our data
  });
}




//task 2
$(document).ready(function () {
  $("#reset").click(function () { // Whenever the reset button is clicked
    $.ajax({ // We are performing an AJAX operation to our server
      method: "GET",
      url: apiUrl,
      dataType: "json"
    }).then(() => {
      getAllItems() // After the fetch operation is done, we are once again getting all the Items
    });;
  })
});

//task 3
$(document).ready(function () {
  getAllItems() // We are fetching data from the server whenever page is loaded and ready
});


// Task 4
$(document).ready(function () {
  $("#submit").click(function () {
    var data = { // We are forming an array to post into our server
      image: $('#image').val(),
      brand: $('#brand').val(),
      model: $('#model').val(),
      os: $('#os').val(),
      screensize: parseInt( $('#screensize').val())
    }
    console.log("data to be sent: ", data)
    $.ajax({
      contentType: 'application/json',
      method: "POST",
      url: apiUrl,
      data: JSON.stringify(data), // Means data:data, since both have the same name it's safe to use this shortcut
      dataType: "json"
    }).then(() => {
      getAllItems() // Whenever we use the CRUD operations of our server we fetch data
    }).catch((err)=> {
      console.log(err)
    });
  })
});

var blink_speed = 500;
var t = setInterval(function () {
    var ele = document.getElementById('blinking');
    ele.style.visibility = (ele.style.visibility == 'hidden' ? '' : 'hidden');
}, blink_speed);


var countDownDate = new Date("Feb 13, 2022 23:59:59").getTime();
var x = setInterval(function() {
  var now = new Date().getTime();
  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("clock").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";

  if (distance < 0) {
    clearInterval(x);
    document.getElementById("clock").innerHTML = "EXPIRED";
  }
}, 1000);


