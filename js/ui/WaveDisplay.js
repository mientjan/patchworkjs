var WaveDisplay = new Class
({
	initialize: function(element)
	{
		this.canvas = new Element('canvas', {class: 'wave_display', width: element.getSize().x, height: element.getSize().y});
		element.grab(this.canvas);
	},
	
	
	draw: function(buffer)
	{
		var canvasSize = this.canvas.getSize();
		var halfHeight = Math.round(canvasSize.y * 0.5);
		var stepSize = Math.floor(buffer.length / canvasSize.x); 
		
		var canvasContext = this.canvas.getContext('2d');
		//canvasContext.strokeStyle = '#fc5300';
		
		var leftChannelData = buffer.getChannelData(1);
		
		// loop through every x-location on canvas
		for(var i = 0; i < canvasSize.x; i++)
		{
			// loop through samples in that step to create an average 
			var startSample = i * stepSize;
			var endSample = startSample + stepSize;
			
			var peak = 0; 
			for(var j = startSample; j < endSample; j++)
			{
				// only use positives for now TODO fix
				var sampleValue = leftChannelData[j];
				if(sampleValue > peak) peak = sampleValue;
			}
			
			var lineHeight = peak * canvasSize.y;
			canvasContext.strokeStyle = "rgba(252, 83, 0, " + (0.1 + peak / 0.9) +  ")"; 
		
			
			canvasContext.beginPath();
			canvasContext.moveTo(i + 0.5, halfHeight - 0.5 * lineHeight);
			canvasContext.lineTo(i + 0.5, halfHeight + 0.5 * lineHeight);
			canvasContext.closePath();
			canvasContext.stroke();
		}
	}
})
