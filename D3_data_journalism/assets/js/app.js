// @TODO: YOUR CODE HERE!
const svgWidth = 960;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 40); // extra padding for third label

// Append an SVG group
const chartGroup = svg.append("g")
  .attr("transform", 'translate(${margin.left}, ${margin.top})');

// Initial Params
let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";

(async function(){

// Import Data
const stateData = await d3.csv("assets/data/data.csv");

// Parse Data/Cast as numbers
stateData.forEach(function(data) {
data.poverty    = +data.poverty;
data.healthcare = +data.healthcare;
data.age        = +data.age;
data.smokes     = +data.smokes;
data.obesity    = +data.obesity;
data.income     = +data.income;
});

// Initialize scale functions
let xLinearScale = xScale(stateData, chosenXAxis);
let yLinearScale = yScale(stateData, chosenYAxis);

// Initialize axis functions
let bottomAxis = d3.axisBottom(xLinearScale);
let leftAxis = d3.axisLeft(yLinearScale);

// Append x and y axes to the chart
let xAxis = chartGroup.append("g")
  .attr("transform", 'translate(0, ${height})')
  .call(bottomAxis);

let yAxis = chartGroup.append("g")
  .call(leftAxis);

// Create scatterplot and append initial circles
let circlesGroup = chartGroup.selectAll("g circle")
.data(stateData)
.enter()
.append("g");

let circlesXY = circlesGroup.append("circle")
.attr("cx", d => xLinearScale(d[chosenXAxis]))
.attr("cy", d => yLinearScale(d[chosenYAxis]))
.attr("r", 15)
.classed("stateCircle", true);

let circlesText = circlesGroup.append("text")
.text(d => d.abbr)
.attr("dx", d => xLinearScale(d[chosenXAxis]))
.attr("dy", d => yLinearScale(d[chosenYAxis]) + 5)
.classed("stateText", true); 

// Create scatterplot and append initial circles
let circlesGroup = chartGroup.selectAll("g circle")
.data(stateData)
.enter()
.append("g");

let circlesXY = circlesGroup.append("circle")
.attr("cx", d => xLinearScale(d[chosenXAxis]))
.attr("cy", d => yLinearScale(d[chosenYAxis]))
.attr("r", 15)
.classed("stateCircle", true);

let circlesText = circlesGroup.append("text")
.text(d => d.abbr)
.attr("dx", d => xLinearScale(d[chosenXAxis]))
.attr("dy", d => yLinearScale(d[chosenYAxis]) + 5)
.classed("stateText", true);

// Create group for 3 x-axis labels
const xlabelsGroup = chartGroup.append("g")
.attr("transform", 'translate(${width / 2}, ${height})');

const povertyLabel = xlabelsGroup.append("text")
.attr("x", 0)
.attr("y", 40)
.attr("value", "poverty") // value to grab for event listener
.text("In Poverty (%)")
.classed("active", true);

const ageLabel = xlabelsGroup.append("text")
.attr("x", 0)
.attr("y", 60)
.attr("value", "age") // value to grab for event listener
.text("Age (Median)")
.classed("inactive", true);

const incomeLabel = xlabelsGroup.append("text")
.attr("x", 0)
.attr("y", 80)
.attr("value", "income") // value to grab for event listener
.text("Household Income (Median)")
.classed("inactive", true);


// initial tooltips
circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

// x axis labels event listener
xlabelsGroup.selectAll("text")
.on("click", function() {
// get value of selection
const value = d3.select(this).attr("value");
if (value !== chosenXAxis) {

    // replaces chosenXAxis with value
    chosenXAxis = value;

    // updates x scale for new data
    xLinearScale = xScale(stateData, chosenXAxis);

    
    // updates x axis with transition
    xAxis = renderXAxes(xLinearScale, xAxis);

    // updates circles with new x values
    circlesXY = renderXCircles(circlesXY, xLinearScale, chosenXAxis);

    // updates circles text with new x values
    circlesText = renderXText(circlesText, xLinearScale, chosenXAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

    