var DestructableEvents = new Class
({
	Extends: Events,
	
	destruct: function()
	{
		console.log('Base destruct function');
		
		this.removeEvents();
	}
})
