// It's also important to note that the native <form> element will NOT submit values from a custom element.
const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host{
            display: block;
            outline: none;
            overflow: auto;
        }
        .wes-auto-resize-textarea {
            box-sizing: content-box;
            border:none;
        }
        .wes-auto-resize-textarea:focus {
            outline: none;
        }
        .wes-auto-resize-placeholder {
            color: rgb(117, 117, 117);

            outline: none !important;
            box-sizing: content-box !important;
            position: absolute !important;
            background-color: transparent !important;
            opacity: 1 !important;
            font-size: inherit !important;
            border: none !important;

            direction: inherit !important;
            pointer-events: none !important;
            text-orientation: inherit !important;
            writing-mode: inherit !important;
        }
    </style>
    <div class="wes-auto-resize-container">
        <div class="wes-auto-resize-placeholder" part="placeholder" style="display:block"></div>
        <div class="wes-auto-resize-textarea" contenteditable="true"></div>
    </div>
`;

class AutoResizeTextarea extends HTMLElement {

	constructor() {
		super();

		this._shadowRoot = this.attachShadow({ mode: 'open' });
		this._shadowRoot.appendChild(template.content.cloneNode(true));

		this.textareaElement = this._shadowRoot.querySelector('.wes-auto-resize-textarea');
		this.placeholderElement = this._shadowRoot.querySelector('.wes-auto-resize-placeholder');

		this.textareaElement.addEventListener('input', (e) => {
			this.value = e.target.textContent;
		});
	}

	get placeholder() {
		return this.getAttribute('placeholder');
	}

	set placeholder(val) {
		if (this.placeholder !== val) {
			this.setAttribute('placeholder', val);
		}
	}

	get value() {
		return this.getAttribute('value');
	}

	set value(val) {
		if (this.value !== val) {
			this.setAttribute('value', val);
		}
	}

    focus(){
        this.textareaElement.focus();
    }


    
	static get observedAttributes() {
		return ['placeholder', 'value'];
	}
    
	attributeChangedCallback(name, oldVal, newVal) {
		if (oldVal === newVal) {
			return;
		}
		if (name === 'placeholder') {
			this.placeholderElement.textContent = newVal;
		}

		if (name === 'value') {
			this.textareaElement.textContent = newVal;
			if (newVal === '' || newVal === undefined || newVal === null) {
				this.placeholderElement.style.display = 'block';
			} else {
				this.placeholderElement.style.display = 'none';
			}
		}
	}

	connectedCallback() {
		this._upgradeProperty('value');
		this._upgradeProperty('placeholder');
	}

	_upgradeProperty(prop) {
		// web component best practice
		// https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
		// https://stackoverflow.com/questions/57151347/make-properties-lazy
		if (this.hasOwnProperty(prop)) {
			const value = this[prop];
			delete this[prop];
			this[prop] = value;
		}
	}
}

window.customElements.define('auto-resize-textarea', AutoResizeTextarea);
