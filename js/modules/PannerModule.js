var PannerModule = new Class
({
	Extends: AbstractModule,
	
	initialize: function(moduleDefinition, patch)
	{
		this.audioNode = patch.context.createPanner();
		this.parent(moduleDefinition);
	},
	
	createModuleContent: function()
	{
		var containerElement = new Element('div');
		
		
		containerElement.adopt(this.createSlidersForAudioParams());
		
		return containerElement;
	},
})

