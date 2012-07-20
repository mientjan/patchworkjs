var Buffer =  new Class
({
	Extends: HasElement,
	
	initialize: function(patch)
	{
		this.patch = patch;
		this.context = patch.context; // TODO clear up
		
		this.name ='[UNTITLED]';
		this.id;
	},
	
	createElement: function()
	{
		var element = new Element('div', {class: 'buffer'});
		
		// unloaded
		this.unloaded = new Element('div', {class: 'unloaded'});
		var urlInput = new Element('input', {type: 'text', class: 'url', value: './audio/flim.mp3'});
		var button = new Element('button', {html: 'Load'});
		
		this.unloaded.grab(urlInput);
		this.unloaded.grab(button);
		
		// listten for click		
		button.addEvent('click', this.handleLoadButtonClick.bind(this));
		
		var loaderImage = new Element('img', {src: 'images/loader.gif'});  
		
		// loading
		this.loading = new Element('div', {html: 'Loading...', class: 'loading'});
		
		// loaded
		this.loaded = new Element('div', {class: 'loaded'});
		var wave = new Element('div', {class: 'wave'});
		var info = new Element('div', {class: 'info'});
		this.loaded.grab(wave);
		this.loaded.grab(info);
		
		// processing
		this.processing = new Element('div', {class: 'processing'});
		this.processing.grab(loaderImage);
		
		// close
		this.closeLink = new Element('a', {text: 'x', class: 'close', href: '#'});
		this.closeLink.addEvent('click', this.onCloseClick.bind(this));
		
		// first state TODO through showstate function
		element.grab(this.unloaded);
		element.grab(this.closeLink);
		
		return element;
	},
	
	onCloseClick: function(event)
	{
		this.patch.removeBuffer(this);
	},
	
	showState: function(state)
	{
		this.element.empty();
		this.element.grab(this[state]);
		this.element.grab(this.closeLink);
	},
	
	onLoadComplete: function(event)
	{
		this.showState('processing');
		
		this.context.decodeAudioData(this.request.response, this.onProcessComplete.bind(this));
	},
	
	onProcessComplete: function(buffer)
	{
		this.buffer = buffer;
		
		var infoText = '<b>' + this.name + '</b>'; 
		infoText += ' - ' + Math.round(buffer.length / buffer.sampleRate) + 's ';
		infoText += (buffer.numberOfChannels == 1 ? 'mono' : "stereo");
		
		this.loaded.getElement('.info').set('html', infoText);
		
		this.showState('loaded');
		
		// create wave display
		this.waveDisplay = new WaveDisplay(this.loaded.getElement('.wave'));
		this.waveDisplay.draw(this.buffer);
	},
	
	onProcessError: function()
	{
		console.log('onprocess error: ');
	},
	
	handleLoadButtonClick: function()
	{
		this.showState('loading');
		
		var url = this.unloaded.getElement('.url').value;
		
		// set name
		var splitUrl = url.split('/');
		this.name = splitUrl[splitUrl.length - 1];
		
		this.request = new XMLHttpRequest();
		this.request.onload = this.onLoadComplete.bind(this);
		this.request.open('GET', url, true);
		this.request.responseType = 'arraybuffer';
		
		this.request.send();
	},
	
	onLoadStart: function(event)
	{
		this.showState('unloaded');
	},
	
	onLoadProgress: function(event)
	{
		this.showState('loading');
		
        var loaded = event.loaded;
        total = event.total;
        console.log(parseInt(loaded / total * 100, 10));
	}
	
})
