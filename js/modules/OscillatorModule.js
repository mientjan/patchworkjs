var OscillatorModule = new Class
({
	Extends: AbstractModule,
	
	initialize: function(moduleDefinition, patch)
	{
		this.audioNode = patch.context.createOscillator();
		
		this.parent(moduleDefinition);
	},
	
	createModuleContent: function()
	{
		var containerElement = new Element('div');
		
		// create wave selector
		var selectElement = new Element('select');
		
		var waves = [{name: 'SINE', value: 0}, {name: 'SQUARE', value: 1}, {name: 'SAWTOOTH', value: 2}, {name: 'TRIANGLE', value: 3}, {name: 'CUSTOM', value: 4}]
		for(var i = 0; i < waves.length; i++)
		{
			var wave = waves[i];
			var optionElement = new Element('option', {html: wave.name, value: wave.value});
			
			selectElement.grab(optionElement);
		}
		
		selectElement.addEvent('change', this.onWaveSelectChange.bind(this));
		
		containerElement.grab(selectElement);
		containerElement.adopt(this.createSlidersForAudioParams());
		
		//new Slider(sliderTrack, sliderKnob, {range: [0,100], initialStep: 30});
		
		return containerElement;
	},
	
	onWaveSelectChange: function(event)
	{
		// set the selected wave
		this.audioNode.type = event.target.value;
	}
	
})

