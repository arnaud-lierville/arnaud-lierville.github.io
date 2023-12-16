let crible = "n = Slider(1,100,2)\n" +
"np = Slider(0,100,1)\n" +
"f(x) = x^2\n" +
"l1 = Sequence((k,f(k)),k,2,n)\n" +
"l2 = Sequence((-k,f(-k)),k,2,n)\n" +
"d = Sequence(Sequence(Segment(l1(i),l2(j)),j,1,n),i,1,n)\n" +
"p = Sequence((0,k)*IsPrime(k),k,1,np)\n" +
"SetPointStyle(p,3)\n" +
"SetColor(p,\"#A50B5E\")\n" +
"SetPointSize(p,10)\n";

let limacon = 
"A = (2,0)\n"+
"l = Sequence(Circle((sin(i),cos(i)),A),i,0,6.283185307179586,0.1)\n"+
"SetLineThickness( l, 1 )\n";


let square = 
"SetAxesRatio(1,1)\n"+
"ShowAxes(False)\n"+
"N = Slider(0,20)\n"+
"Sequence(Rotate(Polygon((-3,-3),(3,-3),(3,3),(-3,3),(-3,-3)),k*2*Pi/20),k,0,N)\n";

let func = 
"ShowGrid(True)\n"+
"f(x)=x^4-2x^3-x^2-7\n"+
"f'\n"+
"f''\n"+
"f'''\n";

let intro = 
"ShowGrid(True)\n"+
"SetAxesRatio(1,1)\n\n"+
"A = (0,0)\n"+
"B = (5,0)\n"+
"C = (5,5)\n"+
"D = (0,5)\n\n"+
"p = Polygon(A,B,C,D)\n"+
"M = Point(p)\n"+
"Circle((1,1),2)\n\n"+
"f(x)=x^3-2x\n"+
"f'\n"+
"lf = LeftSum(f,-1,2,10)\n"+
"SetColor(lf, \"#A50B5E\")\n";

let examplesTable = {
    'crible': crible,
    'limacon': limacon,
    'square': square,
    'func': func,
    'intro': intro,
};

export { examplesTable }