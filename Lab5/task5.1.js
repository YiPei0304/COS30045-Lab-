function init() {
    
        var w = 600;
        var h = 250;
        var barPadding = 3;
        var maxValue = 25; // Maximum value for randomly generated data

        var dataset = [24,10,29,19,8,15,20,12,9,6,21,28];

        // Define the x-scale using D3's scaleBand for bar positioning
        var xScale = d3.scaleBand()
                    .domain(d3.range(dataset.length))
                    .rangeRound([0, w])
                    .paddingInner(0.05);

        // Define the y-scale using D3's scaleLinear for scaling the bar heights
        var yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset)])
                    .range([0, h]);
    
        // Create SVG container
        var svg1 = d3.select("#chart-container")
              .append("svg")
              .attr("width", w)
              .attr("height", h);

        // Add bars to the chart
        svg1.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", function(d, i){
                return xScale(i);
            })
            .attr("y", function(d){
                return h - yScale(d); // Subtract yScale(d) from height for correct positioning
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d){
                return yScale(d); // Use yScale to determine height
            })
            .attr("fill", function(d){
                return "rgb(0, 0, " + Math.round(d * 10) + ")"; 
            });

            //if want the color be grey (all same)[need change below part also]
            //.attr("fill", "slategrey")

            function updateData() {
            var numValues = dataset.length; // Get number of bars
            dataset = []; 

            // Generate random values between 0 and maxValue
            for (var i = 0; i < numValues; i++) {
                var newNumber = Math.floor(Math.random() * maxValue);
                dataset.push(newNumber);
            }

            // Update scales based on new data
            yScale.domain([0, d3.max(dataset)]);

            // Update bars
            svg1.selectAll("rect")
                .data(dataset)
                .transition() // Smooth transition for updated bars
                .duration(500)
                .attr("y", function (d) {
                    return h - yScale(d);
                })
                .attr("height", function (d) {
                    return yScale(d);
                })
                .attr("fill", function (d) {
                    return "rgb(0, 0, " + Math.round(d * 10) + ")";
                });
                //if want the color be grey 
                //.attr("fill", "slategrey")

        }

        // Button click event to update the chart
        d3.select("button")
            .on("click", function () {
                updateData(); // Call the updateData function on button click
            });
}

window.onload = init;
