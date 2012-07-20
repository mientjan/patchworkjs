var BiquadFilterModule = new Class
({
	Extends: AbstractModule,
	
	initialize: function(moduleDefinition, patch)
	{
		this.audioNode = patch.context.createBiquadFilter();
		
		this.parent(moduleDefinition);
	},
	
	createModuleContent: function()
	{
		var containerElement = new Element('div');
		
		// create wave selector
		var selectElement = new Element('select');
		
		var waves = [{name: 'LOWPASS', value: 0}, {name: 'HIGHPASS', value: 1}, {name: 'BANDPASS', value: 2}, {name: 'LOWSHELF', value: 3}, {name: 'HIGHSHELF', value: 4}, {name: 'PEAKING', value: 5}, {name: 'NOTCH', value: 6}, {name: 'ALLPASS', value: 7}]
		for(var i = 0; i < waves.length; i++)
		{
			var wave = waves[i];
			var optionElement = new Element('option', {html: wave.name, value: wave.value});
			
			selectElement.grab(optionElement);
		}
		
		selectElement.addEvent('change', this.onWaveSelectChange.bind(this));
		
		containerElement.grab(selectElement);
		containerElement.adopt(this.createSlidersForAudioParams());
		
		return containerElement;
	},
	
	onWaveSelectChange: function(event)
	{
		// set the selected wave
		this.audioNode.type = event.target.value;
	}
})

