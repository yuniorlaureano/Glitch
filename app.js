function createRows(data){
    var rows = "";

    $(data).each(function(key,item){
        rows += "<tr>" + "<td>" + item.nombre  + "</td>"+ "<td>" + item.posicion  + "</td>"+ "<td>" + item.equipo  + "</td>" + "<tr>";
    });

    $('#export tbody').html(rows);
}

function showModal(modal){
    var modal = document.getElementById(modal)
                        .style.display = "block"; 
}

$(function(){

    window.onclick = function(event) {
        var modal = document.getElementsByClassName('modal')[0]; 
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    document.getElementsByClassName("close")[0].onclick = function() {
        document.getElementsByClassName('modal')[0].style.display = "none";
    }

    document.getElementById("guardar").onclick = function(){
        var payload = {
            nombre: document.getElementById('input-name').value,
            posicion: document.getElementById('input-position').value,
            equipo: document.getElementById('input-equipo').value,
        };

        axios.post('http://localhost:3000/data', payload)
            .then(function(response){
                document.getElementsByClassName('modal')[0].style.display = "none";
                createRows(response.data);
            });
    };

    document.getElementById('add').onclick = function(){
        showModal('myModal');
    };

    axios.get('http://localhost:3000/data')
         .then(function(response){
            createRows(response.data);
        });
});