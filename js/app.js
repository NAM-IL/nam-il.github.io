/**
 * http://usejsdoc.org/
 */

var data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
var w = 200, h = 100;
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

d3.select("body").append("div").text("새로운 문장");

d3.select("body").selectAll("div")
.data(data)
.enter()
.append("div")
.style("height", function (d) { // 높이 설정
  return d + "px";
})
.style("width", function (d) { // 너비 설정
  return "20px";
})
.attr("class", "bar-chart");