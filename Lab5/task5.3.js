function init() {
    var w = 600;
        var h = 300;
        var barPadding = 3;
        var maxValue = 25; // Maximum value for randomly generated data

        var dataset = [24, 10, 29, 19, 8, 15, 20, 12, 9, 6, 21, 28];

        // yScale is used to scale the bar heights based on dataset values
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset) + 5])  
            .range([0, h]);  

        // xScale is used to position bars evenly along the x-axis
        var xScale = d3.scaleBand()
            .domain(d3.range(dataset.length))  
            .rangeRound([0, w])  
            .paddingInner(0.05);  

        // Append the SVG element to the body, which will contain the chart
         var svg1 = d3.select("#chart-container")
         .append("svg")
         .attr("width", w)
         .attr("height", h); 

        // Function to update the bars whenever data changes (called when adding/removing values)
        function updateBars() {
            // Update xScale for the new length of the dataset
            xScale.domain(d3.range(dataset.length));  // Recalculate domain based on dataset length

            // Bind data
            var bars = svg1.selectAll("rect")
                .data(dataset);

            // Enter new bars and update all bars
            bars.enter()
                .append("rect")
                .attr("x", w)  // Initial position off-screen
                .attr("y", function(d) { 
                    return h - yScale(d); 
                })
                .attr("width", xScale.bandwidth())  // Use updated xScale bandwidth
                .attr("height", function(d) { 
                    return yScale(d); 
                })
                .attr("fill", function(d) { 
                    return "rgb(0, 0, " + Math.round(d * 10) + ")"; 
                })
                .merge(bars)
                .transition()
                .duration(500)
                .attr("x", function(d, i) { 
                    return xScale(i); 
                })
                .attr("y", function(d) { 
                    return h - yScale(d); 
                })
                .attr("width", xScale.bandwidth())  // Update the width dynamically
                .attr("height", function(d) { 
                    return yScale(d); 
                });

            
        }

        // Function to add a new value
        function addValue() {
            var newNumber = Math.floor(Math.random() * maxValue);
            dataset.push(newNumber);
            xScale.domain(d3.range(dataset.length)); // Update xScale for new data
            updateBars();
        }

        // Function to remove the first value
        function removeValue() {
            dataset.shift(); // Remove the first element
            xScale.domain(d3.range(dataset.length)); // Update xScale
            var bars = svg1.selectAll("rect").data(dataset);

            bars.exit()
                .transition()
                .duration(500)
                .attr("x", w)
                .remove(); // Remove bars after transition

            updateBars(); // Update remaining bars
        }

        // Button click events
        d3.select("#add").on("click", function() {
            addValue();
        });

        d3.select("#remove").on("click", function() {
            removeValue();
        });

        // Initialize the chart
        updateBars();
}

window.onload = init;
