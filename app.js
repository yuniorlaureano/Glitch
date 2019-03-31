function createRows(data){
    var rows = "";

    $(data).each(function(key,item){
        rows += "<tr>" + "<td>" + item.nombre  + "</td>"+ "<td>" + item.posicion  + "</td>"+ "<td>" + item.equipo  + "</td><td>"+ item.homerun  + "</td>" + "<td><input type='button' data-id='" + item.id + "' value='Remove' class='remove'/><input type='button' data-id='" + item.id + "' value='Edit' class='edit'/></td>" + "<tr>";
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
    document.getElementById('input-homerun').value = "";
}

function initChart(){

    var pulso = [92,76, 89, 100, 54, 117];

    var config = { columnWidth: 45, columnGap: 5, margin: 10, height: 235 };

        d3.select("svg")
            .selectAll("rect")
            .data(pulso)
        .enter().append("rect")
            .attr("width", config.columnWidth)
            .attr("x", function(d,i) {
            return config.margin + i * (config.columnWidth + config.columnGap)
            })
            .attr("y", function(d,i) { return config.height - d })
            .attr("height", function(d,i) { return d });
}

function initChartWithLabel(data){
        //sort bars based on value
        data = data.sort(function (a, b) {
            return d3.ascending(a.value, b.value);
        })

        //set up svg using margin conventions - we'll need plenty of room on the left for labels
        var margin = {
            top: 15,
            right: 25,
            bottom: 15,
            left: 60
        };

        var width = 600 - margin.left - margin.right,
            height = 170 - margin.top - margin.bottom;
            d3.select("svg").remove(); 
        var svg = d3.select("#graphic").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scale.linear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
                return d.value;
            })]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([height, 0], .1)
            .domain(data.map(function (d) {
                return d.name;
            }));

        //make y axis to show bar names
        var yAxis = d3.svg.axis()
            .scale(y)
            //no tick marks
            .tickSize(0)
            .orient("left");

        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        var bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")

        //append rects
        bars.append("rect")
            .attr("class", "bar")
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("height", y.rangeBand())
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.value);
            });

        //add a value label to the right of each bar
        bars.append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y", function (d) {
                return y(d.name) + y.rangeBand() / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", function (d) {
                return x(d.value) + 3;
            })
            .text(function (d) {
                return d.value;
            });
}

function transformDataForChartHomerun(data){
    return data.map(function(jugador){
        return {
            "name": jugador.nombre,
            "value": jugador.homerun
        }
    });
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
            homerun: document.getElementById('input-homerun').value
        };

        axios.post('http://localhost:3000/data', payload)
            .then(function(response){
                document.getElementsByClassName('modal')[0].style.display = "none";
                createRows(response.data);
                initChartWithLabel(transformDataForChartHomerun(response.data));
            });
    };

    document.getElementById("editar").onclick = function(){
        
        var id = document.getElementById('input-id').value;
        var payload = {
            nombre: document.getElementById('input-name').value,
            posicion: document.getElementById('input-position').value,
            equipo: document.getElementById('input-equipo').value,
            homerun: document.getElementById('input-homerun').value,
        };

        axios.put('http://localhost:3000/data/' + id, payload)
            .then(function(response){
                document.getElementsByClassName('modal')[0].style.display = "none";
                createRows(response.data);
                initChartWithLabel(transformDataForChartHomerun(response.data));
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
        document.getElementById('input-homerun').value = $(td[3]).text();
        
    });

    $(document).on('click', '.remove', function(){
    
        axios.delete('http://localhost:3000/data/' + $(this).attr('data-id'))
         .then(function(response){
            createRows(response.data);
            initChartWithLabel(transformDataForChartHomerun(response.data));
        });
    });

    axios.get('http://localhost:3000/data')
         .then(function(response){
            createRows(response.data);            
            initChartWithLabel(transformDataForChartHomerun(response.data));
        });

        initChart();
        //initChartWithLabel();
});