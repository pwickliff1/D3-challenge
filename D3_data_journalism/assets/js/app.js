// @TODO: YOUR CODE HERE!

// Set the svg width and height
var svgWidth = 960;
var svgHeight = 500;

// Set the svg margins
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// Calculate the svg area minus the margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
(async function(){
  var healthData = await d3.csv("./assets/data/data.csv").catch(function(error) {
    console.log(error);
  });

    // Parse Data/Cast as numbers // ==============================
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d.poverty) + 1])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(healthData, d => d.healthcare) + 3])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create "scatter" Circles
    var circlesGroup = chartGroup.selectAll("circle")
			.data(healthData)
			.enter()
			.append("circle")
			.attr("cx", d => xLinearScale(d.poverty))
			.attr("cy", d => yLinearScale(d.healthcare))
			.attr("r", "12")
			.attr("fill", "blue")
			.attr("opacity", ".3");

		// With the circles on our graph, we need matching labels.
		// Let's grab the state abbreviations from our data
		// and place them in the center of our dots.
		chartGroup.select("g")
      .selectAll("circle")
			.data(healthData)
			.enter()
			.append("text")
			.text(d => d.abbr)
			.attr("x", d => xLinearScale(d.poverty))
			.attr("y", d => yLinearScale(d.healthcare))
			.attr("dy",-415)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "black");
			
	
    // Create x axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

   // Create y axes labels
	 chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
	
})()

