function init() {
    
        var w = 600;
        var h = 250;
        var barPadding = 3;
        var maxValue = 25; // Maximum value for randomly generated data

        var dataset = [24, 10, 29, 19, 8, 15, 20, 12, 9, 6, 21, 28];

        // Define the x-scale using D3's scaleBand for bar positioning
        var xScale = d3.scaleBand()
                    .domain(d3.range(dataset.length)) // Set domain as number of bars
                    .rangeRound([0, w])
                    .paddingInner(0.05); // Add padding between bars

        // Define the y-scale using D3's scaleLinear for scaling the bar heights
        var yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset)]) // Scale based on the dataset values
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
                return "rgb(0, 0,  " + Math.round(d * 10) + ")";
            });

        // Function to generate a new random dataset and update the chart
        function updateData() {
            var numValues = dataset.length; 
            dataset = []; 

            // Generate random values between 0 and maxValue
            for (var i = 0; i < numValues; i++) {
                var newNumber = Math.floor(Math.random() * maxValue); // Generate a random number3
                dataset.push(newNumber); // Add the random number to the dataset
            }

            yScale.domain([0, d3.max(dataset)]); // Update yScale domain based on the new dataset

            // Update the bars with a transition effect
            svg1.selectAll("rect")
                .data(dataset)
                .transition()
                .delay(function(d, i) {
                    return i * 100; 
                })
                .duration(500)
                .attr("y", function(d) {
                    return h - yScale(d);
                })
                .attr("height", function(d) {
                    return yScale(d);
                })
                .attr("fill", function(d) {
                    return "rgb(0, 0, " + Math.round(d * 10) + ")";
                });

        }

        // Button click event to update the chart
        d3.select("#update")
            .on("click", function () {
                updateData(); // Call the updateData function on button click
            });

        // Transition 1
        d3.select("#transition1").on("click", function() {
            updateData(); // Update data first to change the dataset values

            svg1.selectAll("rect")
                .transition()
                .delay(function(d, i) {
                    return i * 50; // Faster staggered effect
                })
                .duration(300)
                .ease(d3.easeCubicInOut) // Applying easeCubicInOut
                .attr("y", function(d) {
                    return h - yScale(d); // Update bar position based on new data
                })
                .attr("height", function(d) {
                    return yScale(d); // Update height based on new data
                })
                .attr("fill", function(d) {
                    return "rgb(177, 0, " + Math.round(d * 10) + ")";
                });
        });

        // Transition 2
        d3.select("#transition2").on("click", function() {
            updateData(); // Update data first to change the dataset values

            svg1.selectAll("rect")
                .transition()
                .delay(function(d, i) {
                    return i * 200; // Slower staggered effect
                })
                .duration(1000)
                .ease(d3.easeElasticOut) // Applying easeElasticOut
                .attr("y", function(d) {
                    return h - yScale(d); // Update bar position based on new data
                })
                .attr("height", function(d) {
                    return yScale(d); // Update height based on new data
                })
                .attr("fill", function(d) {
                    return "rgb(0, 200, " + Math.round(d * 10) + ")";
                });

        });
    
}

window.onload = init;
