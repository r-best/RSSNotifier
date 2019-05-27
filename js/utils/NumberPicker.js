/**
 * Tizen TAU Wearable 4.0 page that allows the user to select a number using the rotary dial.
 * Just include this script at the end of the body and either link to it with `<a href="number-picker">`
 * or call the static `pick()` method.
 * When the user selects their number and backs out of the page, the value will be stored in the `data`
 * attribute of an element with id `courier`, which must be present.
 */
class NumberPicker extends HTMLElement{
	constructor(){
		super();

		// Create page header
		this.header = document.createElement('header');
		var title = document.createElement('h2');
		title.setAttribute('class', 'ui-title');
		title.innerHTML = "Pick a number";
		this.header.appendChild(title);
		
		// Create page content
		this.content = document.createElement('div');
		this.content.setAttribute('class', 'ui-content');
		this.display = document.createElement('h1');
		this.display.innerHTML = 0;
		this.content.appendChild(this.display);
		
		// Create page footer
		this.footer = document.createElement('footer');
		this.footer.setAttribute('class', 'ui-footer ui-bottom-button');
		var btn = document.createElement('a');
		btn.setAttribute('class', 'ui-btn');
		btn.innerHTML = "Select";
		btn.addEventListener('click', () => window.history.back())
		this.footer.appendChild(btn);

		// Create rotary event handler function
		this.rotaryHandler = (e) => {
			var direction = e.detail.direction;
			
			if(direction === 'CW') this.increment();
			else if(direction === 'CCW') this.decrement();
		};
	}

	connectedCallback(){
		// Set page attributes
		this.setAttribute("id", "number-picker");
		this.setAttribute("class", "ui-page");
		this.min = this.getAttribute('min');
		if(typeof(this.min) === 'string') this.min = parseInt(this.min);
		this.max = this.getAttribute('max');
		if(typeof(this.max) === 'string') this.max = parseInt(this.max);
		this.step = this.getAttribute('step') || 1;
		this.value = this.getAttribute('value') || 0;

		// Set event handlers
		this.addEventListener('pageshow', () => {
			document.addEventListener('rotarydetent', this.rotaryHandler);
		});
		this.addEventListener("pagehide", () => {
			document.removeEventListener('rotarydetent', this.rotaryHandler);
			document.getElementById('courier').data = this.display.innerHTML;
		});

		// Assemble element
		this.appendChild(this.header);
		this.appendChild(this.content);
		this.appendChild(this.footer);
	}

	increment(){
		// -= is fine for decrement, but we need parseInt here because += thinks we're concatenating
		if(this.max === null || this.display.innerHTML <= this.max-this.step)
			this.display.innerHTML = parseInt(this.display.innerHTML) + this.step;
	}

	decrement(){
		if(this.min === null || this.display.innerHTML >= this.min+this.step)
			this.display.innerHTML -= this.step;
	}
	
	static pick(startVal, min, max, step){
		if(startVal) this.setAttribute("value", startVal);
		if(min) this.setAttribute("min", min);
		if(max) this.setAttribute("max", max);
		if(step) this.setAttribute("step", step);
		tau.changePage("number-picker");
	}
}

// Define the element
customElements.define('number-picker', NumberPicker);
// Add an instance of the element to the body
document.getElementsByTagName("body")[0].appendChild(document.createElement("number-picker"));
// Create a courier to carry the number result back if the user doesn't already have one
if(!document.getElementById('courier')){
	var courier = document.createElement("div");
	courier.setAttribute("id", "courier");
	document.getElementsByTagName("body")[0].appendChild(courier);
}
