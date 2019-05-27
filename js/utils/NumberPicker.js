/**
 * Tizen TAU Wearable 4.0 page that allows the user to select a number using the rotary dial, 
 * just include this script at the end of the body.
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
		btn.addEventListener('click', () => tau.back())
		this.footer.appendChild(btn);

		// Create rotary event handler function
		this.rotaryHandler = (e) => {
			var direction = e.detail.direction;
			
			if(direction === 'CW') this.increment();
			else if(direction === 'CCW') this.decrement();
		};
	}

	connectedCallback(){
		this.setAttribute("id", "number-picker-page");
		this.setAttribute("class", "ui-page");
		this.storeback_id = 'courier'; // id of the element to store the chosen number in when the user leaves the page

		// Set event handlers
		this.addEventListener('pageshow', () => {
			// Set page attributes
			console.log("getval", this.getAttribute('value'))
			this.min = this.getAttribute('min');
			if(typeof(this.min) === 'string') this.min = parseInt(this.min);
			this.max = this.getAttribute('max');
			if(typeof(this.max) === 'string') this.max = parseInt(this.max);
			this.step = this.getAttribute('step') || 1;
			this.display.innerHTML = this.getAttribute('value') || 0;

			document.addEventListener('rotarydetent', this.rotaryHandler);
		});
		this.addEventListener("pagehide", () => {
			document.removeEventListener('rotarydetent', this.rotaryHandler);
			document.getElementById(this.storeback_id).innerHTML = this.display.innerHTML;
		});

		// Assemble element
		this.appendChild(this.header);
		this.appendChild(this.content);
		this.appendChild(this.footer);
	}

	increment(){
		// -= is fine for decrement, but we need parseInt here because += thinks we're concatenating
		if(this.max === null || this.display.innerHTML <= this.max-this.step)
			this.display.innerHTML = parseInt(this.display.innerHTML) + parseInt(this.step);
	}

	decrement(){
		if(this.min === null || this.display.innerHTML >= this.min+this.step)
			this.display.innerHTML -= this.step;
	}
	
	static pick(id, startVal, min, max, step){
		var numberPicker = document.querySelector("#number-picker-page");
		numberPicker.storeback_id = id;
		console.log("startval", startVal);
		if(startVal) numberPicker.setAttribute("value", startVal);
		if(min) numberPicker.setAttribute("min", min);
		if(max) numberPicker.setAttribute("max", max);
		if(step) numberPicker.setAttribute("step", step);
		tau.changePage("#number-picker-page");
	}
}

/**
 * A customized version of the HTML input element that uses the NumberPicker page defined above. Simply
 * place it in your HTML and when the user clicks on it it will open the NumberPicker, allowing them to
 * choose their value.
 * When the user selects their number and backs out of the page, the value will be stored in the innerHTML 
 * of this element.
 */
class NumberPickerActivator extends HTMLElement{
	constructor(){
		super();
		this.addEventListener('click', () => {
			console.log("innerhtml", this.innerHTML)
			NumberPicker.pick(
				this.id,
				this.innerHTML,
				this.getAttribute('min'),
				this.getAttribute('max'),
				this.getAttribute('step')
			);
		});
	}

	connectedCallback(){
		if(!this.getAttribute('id')) this.setAttribute('id', 'courier');
	}
}

// Define the elements
customElements.define('number-picker-page', NumberPicker);
customElements.define('number-picker', NumberPickerActivator);
// Add an instance of the NumberPicker to the body
document.getElementsByTagName("body")[0].appendChild(document.createElement("number-picker-page"));
// Create a courier to carry the number result back if the user doesn't already have one
if(!document.getElementById('courier')){
	var courier = document.createElement("div");
	courier.setAttribute("id", "courier");
	document.getElementsByTagName("body")[0].appendChild(courier);
}
