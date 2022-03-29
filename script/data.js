



var arrProjects = [];

$(document).ready(function(){

    $( "#txtProjectDatePicker" ).datepicker();

    getAllProjects();

    $("#btnDetails").click(function(){    
        getDateAndHoursWorked($("#ddlProjects :selected").text());        
    });

    $("#btnSubmit").click(function(){
        var dataObj = {
            'PROJECT': $("#txtProject").val(),
            'DATE': moment($("#txtProjectDatePicker").val()).format("DD-MMM-YY"),
            'HOURS':  $("#txtProjectHours").val(),
            'Team': $("#txtProjectTeam").val(),
            'Expense' : $("#txtProjectExpense").val(),
            'Remarks': $("#txtProjectRemarks").val()
        }

        postdata(dataObj);
    });
})


 
// // based on the selection of the project

function getAllProjects(){

var totalHours = 0;

  fetch(API_URL).
  then((res)=>res.json()).
  then(result => {
    result.map((item) =>{  
      totalHours += Number(item.HOURS);
        arrProjects.indexOf(item.PROJECT) == -1 ? arrProjects.push(item.PROJECT): ""
    }) 
    
      $("#spnTotalHours").text(totalHours);
    


      arrProjects.map((items)=>{  
        $("#ddlProjects").append("<option>"+items+"</option>")	
      })
    
  })
  
  
 
  
}

function template(data) {

  var tblTopRow = "<tr scope='row' class='bg-dark text-light font-weight-bold'><td width='15%'>Date</td><td width='8%'>Hour</td><td width='20%'>Team</td><td width='8%'>Expense</td><td>Remarks</td></tr>";
	var dataRows = "";
    data.map((item)=>{
      		dataRows += "<tr><td class='p-2'>"+moment(item.DATE).format('MMMM DD, YYYY')+"</td><td>"+item.HOURS+"</td><td>"+item.Team+"</td><td>"+item.Expense+"</td><td>"+item.Remarks +"</td></tr>"
      });


    return "<table class='table table-bordered' />"+tblTopRow + dataRows+"</table>";
}

function getDateAndHoursWorked(projectName){	

  var totalHoursForProject = 0;

    $("#tblContainer").empty();
      fetch(API_URL).
        then((res)=>res.json()).
        then(result => {  
          var filtered =  result.filter(items => items.PROJECT == projectName);
            console.log(filtered); 

            filtered.map((item) =>{  
              totalHoursForProject += Number(item.HOURS);
            });

          $("#spnProjectTotalHours").text("Total for "+projectName+" : "+totalHoursForProject+ " hours");

          $('#paginationContainer').pagination({
                dataSource: filtered,            
                pageSize: 5,            
                showPrevious: false,
                cssStyle: 'light-theme',
                showNext: false,
                callback: function(data, pagination) {
                    var html = template(data);
                    $("#dataContainer").html(html);
                }
            }); 
    })
}



//

function postdata(data_Params){
 $.ajax({
        url: API_URL,
        type: "POST",
        data: JSON.stringify(data_Params),
        contentType: "application/json",
        success: function (data,status) {
           console.log(status);
           $('#staticBackdrop').modal('toggle');
           getAllProjects();
        },
        failure: function (error){
        	console.log(error)
        }
    });
}