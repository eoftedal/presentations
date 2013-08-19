/*global $:false, console:false, Raphael:false */

$(function() {
    $(".urlize").each(function(i, elm) {
        var url = $(elm).text();
        $(elm).text("");
        $("<a>").attr("href", url).text(url).appendTo($(elm));
    });

});


$(function() {
    var box = function(x, y, w, h) {
        w -= 12.875*2;
        h -= 12.876*2;
        x += 12.875;
        return { pathString: "M" + x + "," + y + 
            "h" + w + "c7.109,0,12.875,5.765,12.875,12.876 " + 
            "v" + h + "c0,7.109,-5.765,12.875,-12.875,12.876 " + 
            "h-" + w + "c-7.109,0,-12.875,-5.765,-12.875,-12.876 " + 
            "v-" + h + " c0,-7.109,5.765,-12.875,12.875,-12.876", 
            join: join };
    };
    var round = function(num, places) {
        return Math.round(num * Math.pow(10, places)) / Math.pow(10, places);
    }
    var arrow = function(x1, y1, x2, y2) {
        var ang = Math.atan((x1-x2)/(y1-y2));
        var len = 10;
        return  { pathString: "M" + x1 + "," + y1 +
            "l" + (x2 - x1) + "," + (y2 - y1) +
            "M" + x2 + "," + y2 + 
            "l" + round(Math.sin(ang - Math.PI/4)*len, 3) + "," + round(Math.cos(ang - Math.PI / 4)*len, 3) +
            "M" + x2 + "," + y2 + 
            "l" + round(Math.sin(ang + Math.PI/4)*len, 3) + "," + round(Math.cos(ang + Math.PI / 4)*len, 3),
            join: join};
    };

    var drawtext = function(canvas, x, y, text) {
        var pathString = [];
        var line = canvas.print(x, y, text, canvas.getFont("Vegur"), 20);

        for (var i in line.items) {
            pathString.push(line[i].node.getAttribute("d"));
            line[i].remove();
        }
        return { pathString: pathString.join(" "), join: join};
    };

    var join = function(drawing) {
        this.pathString += drawing.pathString;
        return this;
    };

    var sketch = [];
    var getSketch = function(group) {
        sketch[group] = sketch[group] || { count: 0, step: 0, lines: [], visible: [], text: [] };
        return sketch[group];
    };

    var animateLine = function(canvas, group, path, duration, options) {
        options = options || {};
        var s = getSketch(group);
        s.count++;
        var line = canvas.path(path.pathString).attr({
            stroke: "#000",
            'stroke-width': 0
        });
        var id = group + "-animate-" + s.count;
        line.node.setAttribute('class', id);
        s.lines[id] = {line: line, duration: duration, options: options};
    };

    var animateText = function(canvas, group, x, y, text, duration) {
        animateLine(canvas, group, drawtext(canvas, x, y, text), duration, { strokeWidth: -1, fill: "#000" });
    };

    var associate = function(canvas, group, button) {
        $("#" + button).click(function(evt) {
            evt.preventDefault(); evt.stopPropagation();
            step(canvas, group);
        });
    };
    var step = function(canvas, group) {
        var s = getSketch(group);
        s.step = (s.step + 1) % (s.count + 1);
        if (s.step == 0) {
            for (var i in s.visible) {
                s.visible[i].remove();
            }
            for (var i in s.text) {
                s.text[i].text.attr({opacity: 0});
            }
        } else {
            var id = group + "-animate-" + s.step;
            if (s.lines[id]) {
                var line = s.lines[id].line;
                var length = line.getTotalLength();
                $('path.' + id + '[fill*="none"]').animate({
                    'to': 1
                }, {
                    duration: s.lines[id].duration,
                    step: function(pos, fx) {
                        var offset = length * fx.pos;
                        var subpath = line.getSubpath(0, offset);
                        var subline = canvas.path(subpath).attr({
                            'stroke-width': s.lines[id].options.strokeWidth || 3,
                            stroke: "#000",
                            fill: s.lines[id].options.fill || "none"
                        });
                        if (s.visible[id]) {
                            s.visible[id].remove();
                        }
                        s.visible[id] = subline;
                    },
                    done: function() {
                        if(s.text[id]) {
                            console.log("opac", s.text[id].duration);
                            s.text[id].text.animate({ opacity: 1 }, s.text[id].duration );
                        }
                    }
                });
            } else if(s.text[id]) {
                console.log("opac", s.text[id].duration);
                s.text[id].text.animate({ opacity: 1 }, s.text[id].duration );
            }
        }
    };

    var canvas = Raphael('dds', '780', '450');
    animateLine(canvas, 'group1', box(600, 50, 100, 200), 1000);
    animateText(canvas, 'group1', 610, 270, "Database" , 1000);
    animateLine(canvas, 'group1', arrow(600, 150, 500, 150), 200);
    animateLine(canvas, 'group1', box(400, 50, 100, 200), 1000);
    animateText(canvas, 'group1', 400, 270, "Server side" , 1000);
    animateLine(canvas, 'group1', arrow(400, 150, 300, 150), 200);
    animateLine(canvas, 'group1', box(200, 50, 100, 200), 1000);
    animateText(canvas, 'group1', 220, 270, "HTML" , 1000);
    associate(canvas, 'group1', 'buttondds');


    var canvas = Raphael('dds2', '780', '450');
    animateLine(canvas, 'group2', box(620, 50, 100, 200), 1000);
    animateText(canvas, 'group2', 630, 270, "Database" , 1000);
    animateLine(canvas, 'group2', arrow(620, 150, 520, 150), 200);
    animateLine(canvas, 'group2', box(420, 50, 100, 200), 1000);
    animateText(canvas, 'group2', 420, 270, "Server side" , 1000);
    animateLine(canvas, 'group2', arrow(420, 150, 320, 150), 200);
    animateLine(canvas, 'group2', box(220, 50, 100, 200), 1000);
    animateText(canvas, 'group2', 240, 270, "JSON" , 1000);
    animateLine(canvas, 'group2', arrow(220, 150, 120, 150), 200);
    animateLine(canvas, 'group2', box(20, 50, 100, 200), 1000);
    animateText(canvas, 'group2', 40, 270, "HTML" , 1000);
    associate(canvas, 'group2', 'buttondds2');


});