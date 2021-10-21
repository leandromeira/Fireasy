var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);

go.Shape.defineFigureGenerator("RoundedRectangle", function(shape, w, h) {  // predefined in 2.0
    var param1 = shape ? shape.parameter1 : NaN;
    if (isNaN(param1) || param1 < 0) param1 = 15;  // default corner
    param1 = Math.min(param1, w / 3);
    param1 = Math.min(param1, h / 3);

    var cpOffset = param1 * KAPPA;
    var geo = new go.Geometry()
        .add(new go.PathFigure(param1, 0, true)
            .add(new go.PathSegment(go.PathSegment.Line, w - param1, 0))
            .add(new go.PathSegment(go.PathSegment.Bezier, w, param1, w - cpOffset, 0, w, cpOffset))
            .add(new go.PathSegment(go.PathSegment.Line, w, h - param1))
            .add(new go.PathSegment(go.PathSegment.Bezier, w - param1, h, w, h - cpOffset, w - cpOffset, h))
            .add(new go.PathSegment(go.PathSegment.Line, param1, h))
            .add(new go.PathSegment(go.PathSegment.Bezier, 0, h - param1, cpOffset, h, 0, h - cpOffset))
            .add(new go.PathSegment(go.PathSegment.Line, 0, param1))
            .add(new go.PathSegment(go.PathSegment.Bezier, param1, 0, 0, cpOffset, cpOffset, 0).close()));
    geo.defaultStretch = go.GraphObject.Uniform;
    if (cpOffset > 1) {
        geo.spot1 = new go.Spot(0, 0, cpOffset, cpOffset);
        geo.spot2 = new go.Spot(1, 1, -cpOffset, -cpOffset);
    }
    return geo;
});

go.Shape.defineFigureGenerator('RoundedSeparatedRectangle', function (shape, w, h) {
    var geo = new go.Geometry();
    var param1 = shape ? shape.parameter1 : NaN;
    if (isNaN(param1))
        param1 = .2;
    else if (param1 < .15)
        param1 = .15; // Minimum
    var cpOffset = KAPPA * .2;
    var fig = new go.PathFigure(0, .2 * h, true);
    geo.add(fig);
    fig.add(new go.PathSegment(go.PathSegment.Bezier, .2 * w, 0, 0, (.2 - cpOffset) * h, (.2 - cpOffset) * w, 0));
    fig.add(new go.PathSegment(go.PathSegment.Line, .8 * w, 0));
    fig.add(new go.PathSegment(go.PathSegment.Bezier, w, .2 * h, (.8 + cpOffset) * w, 0, w, (.2 - cpOffset) * h));
    fig.add(new go.PathSegment(go.PathSegment.Line, w, .8 * h));
    fig.add(new go.PathSegment(go.PathSegment.Bezier, .8 * w, h, w, (.8 + cpOffset) * h, (.8 + cpOffset) * w, h));
    fig.add(new go.PathSegment(go.PathSegment.Line, .2 * w, h));
    fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, .8 * h, (.2 - cpOffset) * w, h, 0, (.8 + cpOffset) * h));
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, .2 * h));
    var fig2 = new go.PathFigure(.8 * w, 0, false);
    geo.add(fig2);
    fig2.add(new go.PathSegment(go.PathSegment.Line, .8 * w, h));
    // ??? geo.spot1 = new go.Spot(0, param1);
    // ??? geo.spot2 = new go.Spot(1, 1 - param1);
    return geo;
});

go.Shape.defineFigureGenerator('DoubleRectangle', function (shape, w, h) {
    var geo = new go.Geometry();
    var fig = new go.PathFigure(.1*w, 0, true);
    geo.add(fig);
    //fig.add(new go.PathSegment(go.PathSegment.Line, .2 * w, .1 * h));
    //fig.add(new go.PathSegment(go.PathSegment.Line, .2 * w, 0));
    fig.add(new go.PathSegment(go.PathSegment.Line, w, 0));
    fig.add(new go.PathSegment(go.PathSegment.Line, w, .9 * h));
    fig.add(new go.PathSegment(go.PathSegment.Line, .9 * w, .9 * h));
    fig.add(new go.PathSegment(go.PathSegment.Line, .9 * w, .9 * h));
    //fig.add(new go.PathSegment(go.PathSegment.Line, .8 * w, .9 * h));
    fig.add(new go.PathSegment(go.PathSegment.Line, .9 * w, h));
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, h));
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, .1 * h));
    fig.add(new go.PathSegment(go.PathSegment.Line, .1 * w, .1 * h).close());
    var fig2 = new go.PathFigure(.2 * w, .1 * h, false);
    geo.add(fig2);
    //fig2.add(new go.PathSegment(go.PathSegment.Line, .9 * w, .1 * h));
    //fig2.add(new go.PathSegment(go.PathSegment.Line, .9 * w, .8 * h));
    fig2.add(new go.PathSegment(go.PathSegment.Move, .1 * w, .1 * h));
    fig2.add(new go.PathSegment(go.PathSegment.Line, .9 * w, .1 * h));
    fig2.add(new go.PathSegment(go.PathSegment.Line, .9 * w, .9 * h));
    geo.spot1 = new go.Spot(0, .1);
    geo.spot2 = new go.Spot(.9, 1);
    geo.defaultStretch = go.GraphObject.Uniform;
    return geo;
});

go.Shape.defineFigureGenerator('Cloud', function (shape, w, h) {
    var geo = new go.Geometry()
        .add(new go.PathFigure(.08034461 * w, .1944299 * h, true)
            .add(new go.PathSegment(go.PathSegment.Bezier, .2008615 * w, .05349299 * h, -.09239631 * w, .07836421 * h, .1406031 * w, -.0542823 * h))
            .add(new go.PathSegment(go.PathSegment.Bezier, .4338609 * w, .074219 * h, .2450511 * w, -.00697547 * h, .3776197 * w, -.01112067 * h))
            .add(new go.PathSegment(go.PathSegment.Bezier, .6558228 * w, .07004196 * h, .4539471 * w, 0, .6066018 * w, -.02526587 * h))
            .add(new go.PathSegment(go.PathSegment.Bezier, .8921095 * w, .08370865 * h, .6914277 * w, -.01904177 * h, .8921095 * w, -.01220843 * h))
            .add(new go.PathSegment(go.PathSegment.Bezier, .9147671 * w, .3194596 * h, 1.036446 * w, .04105738 * h, 1.020377 * w, .3022052 * h))
            .add(new go.PathSegment(go.PathSegment.Bezier, .9082935 * w, .562044 * h, 1.04448 * w, .360238 * h, .992256 * w, .5219009 * h))
            .add(new go.PathSegment(go.PathSegment.Bezier, .9212406 * w, .8217117 * h, 1.032337 * w, .5771781 * h, 1.018411 * w, .8120651 * h))
            .add(new go.PathSegment(go.PathSegment.Bezier, .7592566 * w, .9156953 * h, 1.028411 * w, .9571472 * h, .8556702 * w, 1.052487 * h))
            .add(new go.PathSegment(go.PathSegment.Bezier, .5101666 * w, .9310455 * h, .7431877 * w, 1.009325 * h, .5624123 * w, 1.021761 * h))
            .add(new go.PathSegment(go.PathSegment.Bezier, .2609328 * w, .9344623 * h, .4820677 * w, 1.031761 * h, .3030112 * w, 1.002796 * h))
            .add(new go.PathSegment(go.PathSegment.Bezier, .08034461 * w, .870098 * h, .2329994 * w, 1.01518 * h, .03213784 * w, 1.01518 * h))
            .add(new go.PathSegment(go.PathSegment.Bezier, .06829292 * w, .6545475 * h, -.02812061 * w, .9032597 * h, -.01205169 * w, .6835638 * h))
            .add(new go.PathSegment(go.PathSegment.Bezier, .06427569 * w, .4265613 * h, -.01812061 * w, .6089503 * h, -.00606892 * w, .4555777 * h))
            .add(new go.PathSegment(go.PathSegment.Bezier, .08034461 * w, .1944299 * h, -.01606892 * w, .3892545 * h, -.01205169 * w, .1944299 * h)))
        .setSpots(.1, .1, .9, .9);
    geo.defaultStretch = go.GraphObject.Uniform;
    return geo;
});