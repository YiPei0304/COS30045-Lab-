function init() {
    var dataset = [5, 10, 20, 45, 6, 25];

    var ww = 380;
    var h = 380;

    var outerRadius = ww / 2;
    var innerRadius = 0;
    
    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    var pie = d3.pie();
    var color = d3.scaleOrdinal(d3.schemePastel1);

    // Append SVG to the chart container instead of body
    var svg = d3.select('#chartContainer')
        .append("svg")
        .attr("width", ww)
        .attr("height", h);

    var arcs = svg.selectAll("g.arc")
        .data(pie(dataset))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");

    arcs.append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc);

    arcs.append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .text(function(d) { return d.data; });
}

window.onload = init;
