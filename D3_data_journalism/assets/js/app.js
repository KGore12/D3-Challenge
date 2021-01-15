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