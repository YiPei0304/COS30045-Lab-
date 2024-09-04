function init(){
    d3.csv("task2.4.csv").then(function(data){
        console.log(data);
        wombatSightings = data;

        barChart(wombatSightings);
    })

    var w = 500;
    var h = 150;
    var barPadding = 3;

    var svg = d3.select("#chart")
                .append("svg")
                .attr("width",w)
                .attr("height",h);

    function barChart(wombatSightings)
    {
        svg.selectAll("rect")
        .data(wombatSightings)
        .enter()
        .append("rect")
        //x coordinate and y coordinate
        .attr("x",function(d,i){
            return i * (w/wombatSightings.length);
        })
        .attr("y",function(d){
            return h - (d.wombats*4)
        })
        //width and height of the bar chart
        .attr("width",function(d){
            return (w/wombatSightings.length-barPadding);
        })
        .attr("height",function(d){
            return d.wombats*4;
        })
        //colour of the bar changes depending on the value of the data
        .attr("fill",function(d){
            return "rgb(135,206, " + (d.wombats * 8) + ")";
        })

        svg.selectAll("text")
        .data(wombatSightings)
        .enter()
        .append("text")
        .text(function(d){
            return d.wombats;
        })
        .attr("fill", "black")
        .attr("x", function(d,i){
            return i * (w/wombatSightings.length) + 10.5;
        })
        .attr("y", function(d){
            return h - (d.wombats*4)
        })

    }
}
window.onload = init;