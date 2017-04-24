var dataLink = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
var margin = {
  top: 5,
  right: 10,
  bottom: 30,
  left: 75
};

var width = 1000 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var x = d3.scaleBand().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var tx = 5;
var ty = 0;


var chart = d3.select('.chart')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.json(dataLink, json => {
  data = json['data'];
  x.domain(data.map(d => d[0]));
  y.domain([0, d3.max(data.map(d => d[1]))]);

  //X axis setup
  var xAxis = d3.axisBottom(x);
  var tickValues = x.domain().filter(d => d.split('-')[0] % 5 == 0 && d.split('-')[1] == 1);
  var tickFormat = xAxis.tickFormat(d => d.split('-')[0])
  xAxis.tickValues(tickValues);

  chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + 0 + ',' + height + ')')
    .call(xAxis);
  //X axis applied

  //Y axis setup
  var yAxis = d3.axisLeft(y).ticks(10);

  chart.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'rotate(0)')
    .attr('transform', 'translate(' + 0 + ',0)')
    .call(yAxis);
  //Y axis applied

  var tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip');


  chart.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d[0]))
    .attr('y', d => y(d[1]))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d[1]))
    .on('mouseover', () => tooltip.style('display', null))
    .on('mouseout', () => tooltip.style('display', 'none'))
    .on('mousemove', function mousemove(d) {
      tooltip
        .style("left", d3.event.pageX + 30 + "px")
        .style("top", d3.event.pageY - 70 + "px")
        .style("display", "inline-block")
        .html('<h3>' + (d[0].split('-')[0] + '-' + d[0].split('-')[1]) + '</h3>' + "<br>" + '<h5>' + "$" + (d3.format(",.2f")(d[1])) + '</h5>');
    });

});