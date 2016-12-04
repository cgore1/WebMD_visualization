var graph;
var nodes = [];
var edges = [];
var links = [];

function myGraph() {

    // Add and remove elements on the graph object
    this.addNode = function(id) {
        nodes.push({
            "id": id
        });
        update();
    };

    this.removeNode = function(id) {
        var i = 0;
        var n = findNode(id);
        while (i < links.length) {
            if ((links[i]['source'] == n) || (links[i]['target'] == n)) {
                links.splice(i, 1);
            } else i++;
        }
        nodes.splice(findNodeIndex(id), 1);
        update();
    };

    this.removeLink = function(source, target) {
        for (var i = 0; i < links.length; i++) {
            if (links[i].source.id == source && links[i].target.id == target) {
                links.splice(i, 1);
                break;
            }
        }
        update();
    };

    this.removeallLinks = function() {
        links.splice(0, links.length);
        update();
    };

    this.removeAllNodes = function() {
        nodes.splice(0, links.length);
        update();
    };

    this.addLink = function(source, target, value) {
        links.push({
            "source": findNode(source),
            "target": findNode(target),
            "value": value
        });
        update();
    };

    var findNode = function(id) {
        for (var i in nodes) {
            if (nodes[i]["id"] === id) return nodes[i];
        };
    };

    var findNodeIndex = function(id) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id == id) {
                return i;
            }
        };
    };

    // set up the D3 visualisation in the specified element
    var w = $("#member_viz").width(),
        h = 450,
        r = 12;
    var color = d3.scale.category10();

    var vis = d3.select("#member_viz")
        .append("svg:svg")
        .attr("pointer-events", "all")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("perserveAspectRatio", "xMinYMid")
        .append('svg:g');

    var force = d3.layout.force();

    var nodes = force.nodes(),
        links = force.links();

    var update = function() {
        var link = vis.selectAll("line")
            .data(links, function(d) {
                (d);
                return d.source.id + "-" + d.target.id;
            });

        link.enter().append("line")
            .attr("id", function(d) {
                return d.source.id + "-" + d.target.id;
            })
            .attr("stroke-width", function(d) {
                return d.value / 10;
            })
            .attr("class", "link");
        link.append("title")
            .text(function(d) {
                return d.value;
            });
        link.exit().remove();

        var node = vis.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id;
            });

        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        nodeEnter.append("svg:circle")
            .attr("r", 12)
            .attr("id", function(d) {
                return "Node;" + d.id;
            })
            .attr("class", "nodeStrokeClass")
            .attr("fill", function(d) {
                return color(d.id);
            });

        nodeEnter.append("svg:text")
            .attr("class", "textClass")
            .attr("x", 14)
            .attr("y", ".31em")
            .text(function(d) {
                return d.id;
            });

        node.exit().remove();
        var root_node_index = 4;
        force.on("tick", function() {

            node.attr("transform", function(d) {
                if (d.index == root_node_index) {
                    return "translate(" + w / 2 + "," + h / 2 + ")";
                }
                return "translate(" + Math.max(r, Math.min(w - r, d.x)) + "," + Math.max(r, Math.min(h - r, d.y)) + ")";
            });

            link.attr("x1", function(d) {
                    if (d.source.index == root_node_index) {
                        return w / 2;
                    }
                    return Math.max(r, Math.min(w - r, d.source.x + 10));
                })
                .attr("y1", function(d) {
                    if (d.source.index == 4) {
                        return h / 2;
                    }
                    return Math.max(r, Math.min(h - r, d.source.y+10));
                })
                .attr("x2", function(d) {
                    return Math.max(r, Math.min(w - r, d.target.x));
                })
                .attr("y2", function(d) {
                    return Math.max(r, Math.min(h - r, d.target.y));
                });

        });

        // Restart the force layout.
        force
            .gravity(0.01)
            .charge(function(d) {
                return -50 * d.r;
            })
            .friction(0)
            .linkDistance(function(d) {
                return d.value + 20
            })
            .size([w, h])
            .start();
    };


    // Make it all go
    update();
}

function createNetwork(topic) {
    d3.select("#member_viz").html("");
    graph = new myGraph("#member_viz");

    var nodeHash = {};

    var data = member_graph_data["Snack"];

    for (var i = 0; i < data["members"].length; i++) {
        graph.addNode(data["members"][i]);
    }
    for (var i = 0; i < data["links"].length; i++) {
        graph.addLink(data["links"][i]["source"], data["links"][i]["target"], data["links"][i]["weight"]);
    }

    keepNodesOnTop();
}

// because of the way the network is created, nodes are created first, and links second,
// so the lines were on top of the nodes, this just reorders the DOM to put the svg:g on top
function keepNodesOnTop() {
    $(".nodeStrokeClass").each(function(index) {
        var gnode = this.parentNode;
        gnode.parentNode.appendChild(gnode);
    });
}
