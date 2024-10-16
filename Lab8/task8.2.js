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

            // Optional: Load and plot city points (e.g., major cities)
            d3.csv("VIC_city.csv").then(function(cityData) {
                svg.selectAll("circle")
                   .data(cityData)
                   .enter()
                   .append("circle")
                   .attr("cx", d => projection([d.lon, d.lat])[0])
                   .attr("cy", d => projection([d.lon, d.lat])[1])
                   .attr("r", 5)
                   .style("fill", "red")
                   .style("opacity", 0.75);
            });
        }).catch(function(error) {
            console.error("Error loading the GeoJSON file: ", error);
        });
    }).catch(function(error) {
        console.error("Error loading the CSV file: ", error);
    });
}

window.onload = init;
