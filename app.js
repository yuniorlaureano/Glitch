function createRows(data){
    var rows = "";

    $(data).each(function(key,item){
        rows += "<tr>" + "<td>" + item.nombre  + "</td>"+ "<td>" + item.posicion  + "</td>"+ "<td>" + item.equipo  + "</td>" + "<td><input type='button' data-id='" + item.id + "' value='Remove' class='remove'/><input type='button' data-id='" + item.id + "' value='Edit' class='edit'/></td>" + "<tr>";
    });

    $('#export tbody').html(rows);
}

function showModal(modal){
    var modal = document.getElementById(modal)
                        .style.display = "block"; 
}

function clean(){
    document.getElementById('input-id').value = "";        
    document.getElementById('input-name').value = "";
    document.getElementById('input-position').value = "";
    document.getElementById('input-equipo').value = "";
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

    document.getElementById("editar").onclick = function(){
        
        var id = document.getElementById('input-id').value;
        var payload = {
            nombre: document.getElementById('input-name').value,
            posicion: document.getElementById('input-position').value,
            equipo: document.getElementById('input-equipo').value,
        };

        axios.put('http://localhost:3000/data/' + id, payload)
            .then(function(response){
                document.getElementsByClassName('modal')[0].style.display = "none";
                createRows(response.data);
            });
    };

    document.getElementById('add').onclick = function(){
        clean();
        showModal('myModal');
        document.getElementById("editar").style.display = "none";
        document.getElementById("guardar").style.display = "block";        
    };

    $(document).on('click', '.edit', function(){
        clean();
        showModal('myModal');
        document.getElementById("editar").style.display = "block";
        document.getElementById("guardar").style.display = "none";
        var td = $(this).parents('tr').find('td');
        document.getElementById('input-id').value = $(this).attr('data-id');        
        document.getElementById('input-name').value = $(td[0]).text();
        document.getElementById('input-position').value = $(td[1]).text();
        document.getElementById('input-equipo').value = $(td[2]).text();
        
    });

    $(document).on('click', '.remove', function(){
    
        axios.delete('http://localhost:3000/data/' + $(this).attr('data-id'))
         .then(function(response){
            createRows(response.data);
        });
    });

    axios.get('http://localhost:3000/data')
         .then(function(response){
            createRows(response.data);
        });
});