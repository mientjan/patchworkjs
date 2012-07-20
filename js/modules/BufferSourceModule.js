var BufferSourceModule = new Class
({
	Extends: AbstractModule,
	
	initialize: function(moduleDefinition, patch)
	{
		this.patch = patch;
		
		this.audioNode = patch.context.createBufferSource();
		
		this.parent(moduleDefinition);
	},
	
	createModuleContent: function()
	{
		var containerElement = new Element('div');
		
		containerElement.
		
		containerElement.adopt(this.createSlidersForAudioParams());
		
		return containerElement;
	},
	
	createBufferOptions: function()
	{
		for(var i = 0; i < this.patch.buffers.length; i++)
		{
			
		}		
	}
})

