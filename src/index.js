const MAP = Symbol('map');
const KEYS = Symbol('keys');

const hasOwnProperty = Object.prototype.hasOwnProperty;

class OrderedMap {
	constructor(data) {
		this.clear();

		if (data instanceof Map) {
			data.forEach((value, key) => this.set(key, value));
			return this;
		}

		if (Array.isArray(data)) {
			data.forEach(([key, value]) => this.set(key, value));
			return this;
		}

		if (typeof data === 'object') {
			Object.keys(data).forEach((key) => {
				this.set(key, data[key]);
			});
			return this;
		}

		return this;
	}

	get size() {
		return this[KEYS].length;
	}

	has(key) {
		return Reflect.apply(hasOwnProperty, this, [key]);
	}

	get(key) {
		return this[MAP][key];
	}

	set(key, value) {
		if (!this.has(key)) this[KEYS].push(key);

		this[MAP][key] = value;
	}

	getAt(nth) {
		if (!isPositiveInteger(nth)) return [];
		const key = this[KEYS][nth];
		return [key, this[MAP][key]];
	}

	indexOf(key) {
		return this[KEYS].indexOf(key);
	}

	keys() {
		return this[KEYS].slice();
	}

	values() {
		return this[KEYS].map((key) =>  this[MAP][key]);
	}

	forEach(callback) {
		if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`);

		this[KEYS].forEach((key) => {
			callback(this[MAP][key], key, this);
		});
	}

	clear() {
		this[MAP] = {};
		this[KEYS] = [];
	}

	pop(count = 1) {
		if (!isPositiveInteger(count)) return;
		this.remove(this.size - count, count);
	}

	shift(count = 1) {
		if (!isPositiveInteger(count)) return;
		this.shift(0, count);
	}

	remove(start, count) {
		if (!isPositiveInteger(count)) return;
		// fast case
		if (start <= 0 && start + count >= this.size) {
			this.clear();
		} else {
			const removed = this[KEYS].splice(start, count);
			removed.forEach((key) => Reflect.deleteProperty(this[MAP], key));
		}
	}
}

module.exports = OrderedMap;

function isPositiveInteger(num) {
	return num === (num | 0) && num > 0;
}
