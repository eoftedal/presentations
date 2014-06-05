/*global $:false, console:false, Raphael:false */

$(function() {
    $(".urlize").each(function(i, elm) {
        var url = $(elm).text();
        $(elm).text("");
        $("<a>").attr("href", url).text(url).appendTo($(elm));
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
        fig2.box(620, 50, 100, 200)
            .centeredText(670, 270, "Database"),
        fig2.arrow(620, 150, 520, 150, { duration: 200 })
            .centeredText(570, 167, "Query"),
        fig2.box(420, 50, 100, 200)
            .centeredText(470, 270, "Server side"),
        fig2.arrow(420, 150, 320, 150, { duration: 200 })
            .centeredText(370, 167, "JSON"),
        fig2.box(220, 50, 100, 200)
            .centeredText(270, 270, "JavaScript"),
        fig2.arrow(220, 150, 120, 150, { duration: 200 })
            .centeredText(170, 167, "template"),
        fig2.box(20, 50, 100, 200)
            .centeredText(70, 270, "HTML")
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