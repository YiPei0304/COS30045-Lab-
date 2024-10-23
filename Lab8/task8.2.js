function init() {
    var w = 500;  // Adjust the width
    var h = 300;  // Adjust the height

    // Create SVG container
    var svg = d3.select("#chartContainer")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    // Define Mercator projection centered on Victoria
    var projection = d3.geoMercator()
                       .center([145, -36.51])
                       .translate([w / 2, h / 2])
                       .scale(2500);

    var path = d3.geoPath().projection(projection);

    // Define a color scale for unemployment data
    var color = d3.scaleQuantize()
                  .range([
                      "rgb(237,248,233)", 
                      "rgb(186,228,179)", 
                      "rgb(116,196,118)", 
                      "rgb(49,163,84)", 
                      "rgb(0,109,44)"
                  ]);

    // Create a tooltip div (hidden by default)
    var tooltip = d3.select("body").append("div")
                    .attr("id", "tooltip")
                    .style("position", "absolute")
                    .style("text-align", "center")
                    .style("width", "120px")
                    .style("height", "auto")
                    .style("padding", "8px")
                    .style("font", "12px sans-serif")
                    .style("background", "lightsteelblue")
                    .style("border-radius", "8px")
                    .style("pointer-events", "none")
                    .style("opacity", 0);

    // Load unemployment data
    d3.csv("VIC_LGA_unemployment.csv").then(function(data) {
        // Set the domain of the color scale
        color.domain([
            d3.min(data, d => +d.unemployed),
            d3.max(data, d => +d.unemployed)
        ]);

        // Load GeoJSON data for LGAs
        d3.json("LGA_VIC.json").then(function(json) {
            // Merge unemployment data with GeoJSON
            //link from InfinityFree hosting to the URL like https://raw.githubusercontent.com/YiPei0304/COS30045-Lab-/refs/heads/main/Lab8/LGA_VIC.json
            // local use: LGA_VIC.json
            data.forEach(function(d) {
                var dataLGA = d.LGA;
                var dataValue = parseFloat(d.unemployed);

                // Find the corresponding LGA in GeoJSON
                json.features.forEach(function(feature) {
                    if (feature.properties.LGA_name === dataLGA) {
                        feature.properties.unemployed = dataValue;
                    }
                });
            });

            // Draw the map
            svg.selectAll("path")
               .data(json.features)
               .enter()
               .append("path")
               .attr("d", path)
               .attr("fill", function(d) {
                   var value = d.properties.unemployed;
                   return value ? color(value) : "#ccc"; // Default color if no data
               })
               .attr("stroke", "#333")
               .attr("stroke-width", 0.5)
               .on("mouseover", function(event, d) {
                   // Show the tooltip on mouseover
                   var LGAName = d.properties.LGA_name;
                   var unemployed = d.properties.unemployed || "No data";

                   tooltip.style("left", (event.pageX + 10) + "px")
                          .style("top", (event.pageY - 25) + "px")
                          .style("opacity", 1)
                          .html(`<strong>${LGAName}</strong><br>Unemployed: ${unemployed}`);
               })
               .on("mouseout", function() {
                   // Hide the tooltip on mouseout
                   tooltip.style("opacity", 0);
               });
            
            // Add legend for the color scale
            var legendWidth = 200;
            var legendHeight = 10;

            var legend = svg.append("g")
                            .attr("class", "legend")
                            .attr("transform", `translate(${w - legendWidth - 20}, 20)`);

            var legendScale = d3.scaleLinear()
                                .domain(color.domain())
                                .range([0, legendWidth]);

            var legendAxis = d3.axisBottom(legendScale)
                               .ticks(5)
                               .tickFormat(d3.format(".0f"));

            legend.selectAll("rect")
                  .data(color.range().map(function(d) {
                      var inverse = color.invertExtent(d);
                      if (inverse[0] === undefined) inverse[0] = legendScale.domain()[0];
                      if (inverse[1] === undefined) inverse[1] = legendScale.domain()[1];
                      return inverse;
                  }))
                  .enter().append("rect")
                  .attr("x", d => legendScale(d[0]))
                  .attr("y", 0)
                  .attr("width", d => legendScale(d[1]) - legendScale(d[0]))
                  .attr("height", legendHeight)
                  .style("fill", d => color(d[0]));

            legend.append("g")
                  .attr("transform", `translate(0, ${legendHeight})`)
                  .call(legendAxis);
            

        // Load and plot city points (e.g., major cities)
        d3.csv("VIC_city.csv").then(function(cityData) {
        svg.selectAll("circle")
       .data(cityData)
       .enter()
       .append("circle")
       .attr("cx", d => projection([+d.lon, +d.lat])[0]) // Longitude first
       .attr("cy", d => projection([+d.lon, +d.lat])[1]) // Latitude second
       .attr("r", 5)
       .style("fill", "red")
       .style("opacity", 0.75)
       .on("mouseover", function(event, d) {
           // Show the tooltip with the correct city name key
           var cityName = d.place;  // show city name 
           tooltip.style("left", (event.pageX + 10) + "px")
                  .style("top", (event.pageY - 25) + "px")
                  .style("opacity", 1)
                  .html(`<strong>${cityName}</strong>`); // Use the correct city name
       })
       .on("mouseout", function() {
           // Hide the tooltip
           tooltip.style("opacity", 0);
       });
});
        }).catch(function(error) {
            console.error("Error loading the GeoJSON file: ", error);
        });
    }).catch(function(error) {
        console.error("Error loading the CSV file: ", error);
    });
}


window.onload = init;
