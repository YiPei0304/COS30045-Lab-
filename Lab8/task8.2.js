function init() {
    // Set the dimensions for the SVG container
    var w = 500;  // Adjusted width as per the image
    var h = 300;  // Adjusted height as per the image

    // Create an SVG element
    var svg = d3.select("#chartContainer")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("fill", "grey");

    // Define the Mercator projection for Victoria (as per your screenshot)
    var projection = d3.geoMercator()
                       .center([145, -36.51]) // Center for Victoria, Australia
                       .translate([w / 2, h / 2]) // Translate to the center of the SVG
                       .scale(2450);  // Adjust scale for better view

    // Define the path generator using the projection
    var path = d3.geoPath().projection(projection);

    // Load the GeoJSON data (LGA VIC map in your example)
    d3.json("LGA_VIC.json").then(function(json) {
        // Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
           .data(json.features)
           .enter()
           .append("path")
           .attr("d", path)
           .attr("fill", "#69b3a2")
           .attr("stroke", "#333");
    }).catch(function(error) {
        console.error("Error loading the GeoJSON file: ", error);
    });


    
}

window.onload = init;
