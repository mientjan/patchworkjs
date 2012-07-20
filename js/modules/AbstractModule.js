var AbstractModule = new Class
({
	Extends: Node,
	
	initialize: function(moduleDefinition)
	{
		this.moduleDefinition = moduleDefinition;
		this.type = moduleDefinition.type // TODO get rid of this (is also in the definition)
		
		if(!this.audioNode) 
		{
			console.error('No AudioNode found in module: ' + this.type);
			return;
		}
		
		this.parent(this.moduleDefinition.name, this.audioNode ? this.audioNode.numberOfInputs : 0, this.audioNode ? this.audioNode.numberOfOutputs : 0);
	},
	
	createModuleContent: function()
	{
		return new Element('div');
	},
	
	createSlidersForAudioParams: function()
	{
		var sliders = [];
		var params = this.getAudioParams();
		for(var i = 0; i < params.length; i++)
		{
			var slider = new Element('div', {class: 'slider'});

			// create track + knob + info
			var sliderTrack = new Element('div', {class: 'track'});
			var sliderKnob = new Element('div', {class: 'knob'});
			var info = new Element('div', {class: 'info', html: params[i].name + '<span class="value"></span>'});
			
			slider.grab(info);
			sliderTrack.grab(sliderKnob);
			slider.grab(sliderTrack);
			
			// store the audioparam TODO blegh!
			slider.store('audioParam', params[i]);
			
			sliders.push(slider);
		}
		
		return sliders;
	},
	
	getAudioParams: function()
	{
		var results = [];
		for(var key in this.audioNode)
		{
			var className = getObjectClass(this.audioNode[key]);
			if(className == 'AudioParam' || className == 'AudioGain') results.push(this.audioNode[key]);
		}
		return results;
	},
	
	toJSON: function()
	{
		return {type: this.type, id: this.id};
	},
	
	destruct: function()
	{
		console.log('Destruct module');
		if(this.audioNode)
		{
			// TODO disconnect everything connected to this output and input 
		}
		this.audioNode = null;
		this.type = null;
		this.context = null;
		
		this.parent();
	}
	
});
