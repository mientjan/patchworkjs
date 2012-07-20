var DestinationModule = new Class
({
	Extends: AbstractModule,
	
	initialize: function(moduleDefinition, patch)
	{
		this.audioNode = patch.context.destination;
		
		this.parent(moduleDefinition);
	}
	
})
