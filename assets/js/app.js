// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 620;

var margin = {
  top: 20,
  right: 40,
  bottom: 200,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .classed("chart", true);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

// Initial Params
var chosenXAxis = "poverty";

// Function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
      d3.max(stateData, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);

    return xLinearScale;
}

//Function for updating the xAxis upon click
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

//Function for updating the circles with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))

  return circlesGroup;
}

//Function for updating State labels
function renderText(circleText, newXScale, chosenXAxis) {

  circleText.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));

  return circleText;
}

// Function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;
  
  if (chosenXAxis === "poverty") {
    label = "Poverty (%)";
    }
  else  {
    label = "Household Income";
    }
  
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, -0])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}<br>Lacks healthcare: ${d.healthcare}`);
        });
  
  circlesGroup.call(toolTip);
  
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  });

  return circlesGroup;

  }
// ==============================
// Import Data
// ==============================

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(stateData) {

// Step 1: Parse Data/Cast as numbers
// ==============================
  stateData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.income = +data.income;
    console.log(data);
    });

    // Step 2: Create scale functions
    // ==============================
    // Create xLinearScale & yLinearScale functions for the Chart
  var xLinearScale = xScale(stateData, chosenXAxis);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.healthcare)])
    .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    // Append x axis
  var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    //Append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "12")
    .classed("stateCircle", true)

  //create text within circles
  var circleText = chartGroup.selectAll(".stateText")
      .data(stateData)
      .enter()
      .append("text")
      .classed("stateText", true)
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d.healthcare))
      .attr("font-size", "10px")
      .text(function(d) { return d.abbr })

  //Create a group for the x axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .classed("active", true)
    .text("Poverty (%)")
    .attr("value", "poverty")
    .attr("font-weight", "bold")
    .classed("aText", true);

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .text("Household Income (Median)")
    .attr("value", "income")
    .attr("font-weight", "bold")
    .classed("inactive", true)
    .classed("aText", true);

    // Append y axis label
    //Create a group for Y labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", -40 - (height / 2))
    .attr("dy", "1em")
    .text("Lacks Healthcare (%)")
    .attr("font-weight", "bold")
    .classed("aText", true);

  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
  labelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

      // replaces chosenXAxis with value
      chosenXAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(stateData, chosenXAxis);

      // updates x axis with transition
      xAxis = renderAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

      // updates tooltips with new info
      circleText = renderText(circleText, xLinearScale, chosenXAxis);
      
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      //change classes to change bold text
      if (chosenXAxis === "poverty") {
        povertyLabel.classed("active", true).classed("inactive", false);
        incomeLabel.classed("active", false).classed("inactive", true);
              } else {
                  povertyLabel.classed("active", false).classed("inactive", true);
                  incomeLabel.classed("active", true).classed("inactive", false);
              }
          }
      });
}).catch(function(error) {
console.log(error);
});