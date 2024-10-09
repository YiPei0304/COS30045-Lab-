function init() {
    var w = 600;
    var h = 300;
    var padding = 40;

    // Load the CSV data
    d3.csv("unemployment.csv", function (d) {
        return {
            date: new Date(+d.year, +d.month - 1),
            number: +d.number
        };
    }).then(function(dataset) {
        // Log dataset to verify
        console.table(dataset, ["date", "number"]);

        // Create scales
        var xScale = d3.scaleTime()
            .domain([d3.min(dataset, function (d) { return d.date; }), d3.max(dataset, function (d) { return d.date; })])
            .range([padding, w - padding]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, function (d) { return d.number; })])
            .range([h - padding, padding]);

        // Define the area generator
        var area = d3.area()
            .x(function (d) { return xScale(d.date); })
            .y0(function () { return yScale.range()[0]; })  // Bottom of the area (y0)
            .y1(function (d) { return yScale(d.number); }); // Top of the area (y1)

        // Create the SVG container
        var svg = d3.select("#chartContainer")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        // Create the area path
        svg.append("path")
            .datum(dataset)
            .attr("class", "area")
            .attr("fill", "lightblue") //can change area color
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", area);

        // Add annotations for half a million unemployed
        svg.append("line")
            .attr("class", "line halfMilMark")
            .attr("x1", padding)
            .attr("y1", yScale(500000))
            .attr("x2", w - padding)
            .attr("y2", yScale(500000))
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5");  // Dashed line for emphasis

        svg.append("text")
            .attr("class", "halfMilLabel")
            .attr("x", padding + 10)
            .attr("y", yScale(500000) - 7)  // Position slightly above the line
            .text("Half a million unemployed")
            .attr("fill", "red")
            .attr("font-size", "12px");

        // Add axes
        var xAxis = d3.axisBottom(xScale).ticks(5);
        var yAxis = d3.axisLeft(yScale).ticks(5);

        // Append X-axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis);

        // Append Y-axis
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);
    });
}

window.onload = init;
