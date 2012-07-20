var ConvolverModule = new Class
({
	Extends: AbstractModule,
	
	initialize: function(moduleDefinition, patch)
	{
		this.audioNode = patch.context.createConvolver();
		
		this.parent(moduleDefinition);
	},
	
	createModuleContent: function()
	{
		var containerElement = new Element('div');
		
		
		containerElement.adopt(this.createSlidersForAudioParams());
		
		return containerElement;
	},
})

