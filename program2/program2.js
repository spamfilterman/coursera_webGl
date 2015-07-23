"use strict";

var canvas;
var gl;

var maxNumVertices  = 20000;
var index = 0;

var cindex = 0;

var colors = [

    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0)   // cyan
];

var numCurves = 0;
var curveIndex = 0;
var numIndices = [];
numIndices[0] = 0;
var start = [0];
start[0] = 0;
var makingLine = false;

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var m = document.getElementById("mymenu");
    m.addEventListener("click", function() {
       cindex = m.selectedIndex;
        });

	canvas.addEventListener("mouseup", function(event){
		//console.log( "mouseup" );
		if( makingLine )
		{
			//console.log( "  ending line" );
			
			var t = vec2(2*event.clientX/canvas.width-1,
					2*(canvas.height-event.clientY)/canvas.height-1);
				
			gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
			gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));

			t = vec4(colors[cindex]);
			gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
			gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));
        
			numIndices[curveIndex]++;
	        index++;
		
			makingLine = false;
			curveIndex++;
		
			render();
		}
	} );

    canvas.addEventListener("mousedown", function(event){
		//console.log( "mousedown" );
		if( makingLine == false )
		{
			//console.log( "  starting new line" );
			numCurves++;
			numIndices[curveIndex] = 0;
			start[curveIndex] = index;	
			makingLine = true;
		
	        var t  = vec2(2*event.clientX/canvas.width-1,
	           2*(canvas.height-event.clientY)/canvas.height-1);
	        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	        gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));

	        t = vec4(colors[cindex]);

	        gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
	        gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));

	        numIndices[curveIndex]++;
	        index++;
		
			render();
		}

    } );


	canvas.addEventListener("mousemove", function(event){
		//console.log( "mousemove" );
		if( makingLine )
		{
			//console.log( "  adding point.." );
			var t = vec2(2*event.clientX/canvas.width-1,
					2*(canvas.height-event.clientY)/canvas.height-1);
				
			gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
			gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));

			t = vec4(colors[cindex]);
			gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
			gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));
        
			numIndices[curveIndex]++;
	        index++;
		
			render();
		}
	});

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );

    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
	
	render();
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
	
	//console.log("render  numCurves: ", numCurves);

    for(var i=0; i<numCurves; i++) {
		console.log( "  numIndices[i]: ", numIndices[i] );
        //gl.drawArrays( gl.POINTS, start[i], numIndices[i] );
		gl.drawArrays( gl.LINE_STRIP, start[i], numIndices[i] );
    }
	
}
