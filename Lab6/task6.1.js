function init() {
    var w = 600;
        var h = 300;
        var barPadding = 3;
        var maxValue = 25;

        var dataset = [24, 10, 29, 19, 8, 15, 20, 12, 9, 6, 21, 28];

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset) + 5])
            .range([0, h]);

        var xScale = d3.scaleBand()
            .domain(d3.range(dataset.length))
            .rangeRound([0, w])
            .paddingInner(0.05);

            var svg1 = d3.select("#chart-container")
            .append("svg")
            .attr("width", w)
            .attr("height", h); 

        // Function to update the bars whenever data changes
        function updateBars() {
            xScale.domain(d3.range(dataset.length));

            //bind data
            var bars = svg1.selectAll("rect")
                .data(dataset);

            // Enter new bars and update all bars
            bars.enter()
                .append("rect")
                .attr("x", w)
                .attr("y", function(d) { return h - yScale(d); })
                .attr("width", xScale.bandwidth())
                .attr("height", function(d) { return yScale(d); })
                .attr("fill", "slategrey")  // Initial color
                .merge(bars)
                .on("mouseover", function(event, d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("fill", "orange"); //clor when mouse point at the bar

                    svg1.append("text")
                        .attr("id", "tooltip")
                        .attr("x", parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2)
                        .attr("y", h - yScale(d) - 10)
                        .attr("text-anchor", "middle")
                        .attr("font-size", "14px")
                        .attr("fill", "black")
                        .text(d);
                })
                .on("mouseout", function(d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("fill", "slategrey")  // after point, return back to the initial color

                    d3.select("#tooltip").remove();  // Remove the SVG tooltip
                })
                .transition()
                .duration(500)
                .attr("x", function(d, i) { return xScale(i); })
                .attr("y", function(d) { return h - yScale(d); })
                .attr("width", xScale.bandwidth())
                .attr("height", function(d) { return yScale(d); });

            bars.exit()
                .transition()
                .duration(500)
                .attr("x", w)
                .remove();
        }

        function addValue() {
            var newNumber = Math.floor(Math.random() * maxValue);
            dataset.push(newNumber);
            updateBars();
        }

        function removeValue() {
            dataset.shift();
            updateBars();
        }

        d3.select("#add").on("click", function() {
            addValue();
        });

        d3.select("#remove").on("click", function() {
            removeValue();
        });

        updateBars();  // Initialize the chart
}

window.onload = init;
