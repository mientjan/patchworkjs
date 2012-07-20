function EventDispatcher()
{
	var _events = {};
	
	this.addEventListener = function(eventName, handler)
	{
		if(typeof(_events[eventName]) == 'undefined')
		{
			_events[eventName] = [];		
		}
		
		_events[eventName].push(handler);
		
	//	console.log('EventListener added to: ' + eventName);
	}
	
	
	
	this.removeEventListener = function(eventName, handler)
	{
		if(typeof(_events[eventName]) == 'undefined')
		{
			console.log('No handler registered for event: ' + eventName);
			
			return;
		}
		
		var removed = 0;
		for (var i = 0; i < _events[eventName].length; i++)
		{
			if( _events[eventName][i] == handler)
			{
				_events[eventName][i] = null;
				removed++;
			}
		}
		
		if(removed == 0)
		{
			console.log('Nothing removed, handler not registered to event: ' + eventName);
		}
		else
		{
			console.log(removed + ' handler(s) removed from event: ' + eventName);
		}
	}
	
	this.dispatchEvent = function(eventName, params)
	{
		if(typeof(_events[eventName]) != 'undefined')
		{
			var handlers = _events[eventName];
			for (var i = 0; i < handlers.length; i++)
			{
				handlers[i]({type: eventName, target: this, params: params});
			}
		}
	}
}

