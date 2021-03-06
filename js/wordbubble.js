function showWordBubble(topic)
{
$(document).ready(function() {

var width = $("#wordbubble").outerWidth(),
    height = $("#wordbubble").outerHeight(),
    padding = 1.5, // separation between same-color nodes
    clusterPadding = 6, // separation between different-color nodes
    maxRadius = 25;


if(!topic)
  return;
var data = tfidfD[topic][0];

var n = 15, // total number of nodes
    m = 1; // number of distinct clusters

var wordAndMeanings = [];
for(var i in data)
{
  wordAndMeanings.push(i);
}
n = wordAndMeanings.length;

var color = d3.scale.category10()
    .domain(d3.range(m));

// The largest node for each cluster.
var clusters = new Array(m);
var index = 0;
var nodes = d3.range(n).map(function () {
    test = "Test";
    var i = Math.floor(Math.random() * m),
        r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius + name.length,
        d = {
            name: test,
            cluster: i,
            radius: r,
            name: wordAndMeanings[index++],
            x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
            y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
        };
    if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
    return d;

});

var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(.02)
    .charge(0)
    .on("tick", tick)
    .start();
d3.select("#wordbubble").html('');
var svg = d3.select("#wordbubble").append("svg")
    .attr("width", width)
    .attr("height", height);

var node = svg.selectAll("circle")
    .data(nodes)
    .enter().append("g").call(force.drag);
//addcircle to the group
node.append("circle")
    .style("fill", function (d) {
    return "#26b99a";
}).attr("r", function(d){return d.radius}).on("click",
        function(d) {
            d3.select("#wordmeaning").html( '<b>' + d.name.charAt(0).toUpperCase() + d.name.slice(1) + '</b> : ' + data[d.name][0]);
        }

		);
//add text to the group
node.append("text")
    .text(function (d) {
    return d.name;
})
.attr("dx", 0)
    .attr("dy", ".35em")
    .text(function (d) {
    return d.name
}).on("click",
        function(d) {
            d3.select("#wordmeaning").html( '<b>' + d.name.charAt(0).toUpperCase() + d.name.slice(1) + '</b> : ' + data[d.name][0]);
        });


function tick(e) {
    node.each(cluster(10 * e.alpha * e.alpha))
        .each(collide(.5))
    //.attr("transform", functon(d) {});
    .attr("transform", function (d) {
        var k = "translate(" + d.x + "," + d.y + ")";
        return k;
    })

}

// Move d to be adjacent to the cluster node.
function cluster(alpha) {
    return function (d) {
        var cluster = clusters[d.cluster];
        if (cluster === d) return;
        var x = d.x - cluster.x,
            y = d.y - cluster.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + cluster.radius;
        if (l != r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            cluster.x += x;
            cluster.y += y;
        }
    };
}

// Resolves collisions between d and all other circles.
function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function (d) {
        var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
}



      });
}
