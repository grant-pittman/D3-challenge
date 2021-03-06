async function makeResponsive() {
  var svgWidth = 960;
  var svgHeight = 500;

  var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Importing Data
  (async function(){
    var censusData = await d3.csv("assets/data/data.csv").catch(function(error) {
      console.log(error);
    });


      // Parse Data/Cast as numbers
      
      censusData.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
      });

      // Create scale functions

      var xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(censusData, d => d.age)])
        .range([0, width]);

      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.smokes)])
        .range([height, 0]);

      // Create axis functions
      
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      // Append Axes to the chart

      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      chartGroup.append("g")
        .call(leftAxis);

      // Create Circles
      
      var circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.age))
      .attr("cy", d => yLinearScale(d.smokes))
      .attr("r", "15")
      .attr("fill", "pink")
      .attr("opacity", ".5");

      //Creating the circle labels
      chartGroup.selectAll("text")
      .data(censusData)
      .enter()
      .append("text")
      .attr("x", function(data, index) {
        return xLinearScale(data.age);
      })
      .attr("y", function(data, index) {
        return yLinearScale(data.smokes);
      })
      .text(function(data, index) {
        return data.abbr;
      });
      
      // Initialize tool tip
      
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>Age: ${d.age}<br>Smokes: ${d.smokes}`);
        });

      // Create tooltip in the chart
      
      chartGroup.call(toolTip);

      // Create event listeners to display and hide the tooltip
      
      circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Smokes");

      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Age");
  })()
}

makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);