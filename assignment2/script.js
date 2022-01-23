//task 1
//source: https://www.w3schools.com/howto/howto_js_sort_table.asp
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

const getAllItems = () => {
  $.ajax({
    method: "GET",
    url: "https://wt.ops.labs.vu.nl/api22/3ab02f27",
    dataType: "json"
  }).done(function (data) {
    var content = `
    <table id="table">
    <caption id="caption">Product List</caption>
    <tr id="content">
        <th>Image</th>
        <th onclick="sortTable(1)">Brand</th>
        <th onclick="sortTable(2)">Model</th>
        <th onclick="sortTable(3)">OS</th>
        <th onclick="sortTable(4)">Screensize</th>
    </tr>`;
    for (var i = 0; i < data.length; ++i) {
      content += "<tr>";
      content += `<td><img alt=picture height=150 src='${data[i].image}'/></td>`;
      content += "<td>" + data[i].brand + "</td>";
      content += "<td>" + data[i].model + "</td>";
      content += "<td>" + data[i].os + "</td>";
      content += "<td>" + data[i].screensize + "</td>";
      content += "</tr>";
    }
    content += "</table>"
    $("#table").replaceWith(content);
  });
}


//task 2
$(document).ready(function () {
  $("#reset").click(function () {
    $.ajax({
      method: "GET",
      url: "https://wt.ops.labs.vu.nl/api22/3ab02f27/reset",
      dataType: "json"
    }).then(() => {
      getAllItems()
    });;
  })
});

//task 3
$(document).ready(function () {
  getAllItems()
});

/*
//task 4
$(document).ready(function(){
  $("#submit").click(function(){
    $.ajax({
      type: "POST",
      url: "https://wt.ops.labs.vu.nl/api22/3ab02f27",
      dataType: "json",
    });
  });
});
*/

// Task 4
$(document).ready(function () {
  $("#submit").click(function () {
    var data = {
      image: $('#image').val(),
      brand: $('#brand').val(),
      model: $('#model').val(),
      os: $('#os').val(),
      screensize: $('#screensize').val()
    }
    $.ajax({
      method: "POST",
      url: "https://wt.ops.labs.vu.nl/api22/3ab02f27",
      data,
      dataType: "json"
    }).then(() => {
      getAllItems()
    });;
  })
});


//i use this function to see if array is updated
// $(document).ready(function () {
//   $.ajax({
//     url: "https://wt.ops.labs.vu.nl/api22/3ab02f27",
//     method: "GET",
//     dataType: "json"
//   }).done(function (data) {
//     console.log(data);
//   });
// });
