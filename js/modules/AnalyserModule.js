var AnalyserModule = new Class
({
	Extends: AbstractModule,
	
	initialize: function(moduleDefinition, patch)
	{
		this.audioNode = patch.context.createAnalyser();
		
		this.analysisArray = new Uint8Array(this.audioNode.frequencyBinCount);
		this.parent(moduleDefinition);
	},
	
	createModuleContent: function()
	{
		var containerElement = new Element('div');
		
		this.canvas = new Element('canvas', {class: 'analyser', width: '180px'});
		
		containerElement.grab(this.canvas);
		this.canvasContext = this.canvas.getContext('2d');
		this.canvasContext.strokeStyle = '#fc5300';
		
		
		this.updateInterval = setInterval(this.updateCanvas.bind(this), 50);
		
		console.log(this.audioNode);
		
		return containerElement;
	},
	
	updateCanvas: function()
	{
		this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.audioNode.getByteFrequencyData(this.analysisArray);
		
		var scale = .5;
		//console.log(this.analysisArray.length);
		var skip = 4;
		var len = this.analysisArray.length / skip;
		var height = this.canvas.height;
		this.canvasContext.beginPath();
		for(var i = 0; i < len; i++)
		{
			this.canvasContext.moveTo(i, height);
			this.canvasContext.lineTo(i, height - this.analysisArray[i * skip] * scale);
			//console.log(this.analysisArray[i]);
		}
		this.canvasContext.closePath();
		this.canvasContext.stroke();
		//console.log(this.analysisArray[800]);
		//console.log(this.analysisArray[900]);
	},
	
	destruct: function()
	{
		clearInterval(this.updateInterval);
		
		this.updateInterval = null;
		
		this.parent();
	}
})

