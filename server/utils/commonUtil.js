const sortArrayByField = (arr, field) => arr.sort((a, b) => {
    return a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0; // eslint-disable-line
});
const equalArrayObjects = (arr1, arr2, field) => {
	const sort1 = sortArrayByField(arr1, field);
	const sort2 = sortArrayByField(arr2, field);
	return sort1.filter(({ [field]: id1 }) => sort2.some(({ [field]: id2 }) => id2 === id1));
};
const diffArrayObjects = (arr1, arr2, field) => {
	const sort1 = sortArrayByField(arr1, field);
	const sort2 = sortArrayByField(arr2, field);
	return sort1.filter(({ [field]: id1 }) => !sort2.some(({ [field]: id2 }) => id2 === id1));
};

const formDataToJSON = (formData) => {
	function handleChildFormData (obj, keysArr, value) {
		let firstK = keysArr.shift();
		firstK = firstK.replace("]", "");
		if (keysArr.length === 0) {
			if (firstK === "") {
				if (!Array.isArray(obj)) {
					obj = [];
				}
				obj.push(value);
			} else {
				obj[firstK] = value;
			};
		} else {
			if (firstK === "") {
				obj.push(value);
			} else {
				if (!(firstK in obj)) {
					obj[firstK] = {};
				}
				obj[firstK] = handleChildFormData(obj[firstK], keysArr, value);
			}
		}
		return obj;
	};
	function fixedDirtyJSON (obj) {
		const data = {};
		const keys = Object.keys(obj).map(item => toNumber(item));
		const isArray = keys.every(item => typeof item === "number");
		if (isArray) {
			const arr = [];
			for (const key of keys) {
				if (typeof obj[key] !== "undefined") {
					if (typeof obj[key] === "object") {
						arr.push(obj[key]);
					}
				}
			}
			return arr;
		} else {
			for (const key of keys) {
				if (typeof obj[key] !== "undefined") {
					if (typeof obj[key] === "object") {
						data[key] = fixedDirtyJSON(obj[key]);
					} else {
						data[key] = obj[key];
					}
				}
			}
		}
		return data;
	};

	let dirtyJSON = {};
	const formDataEntries = Object.entries(formData);

	for (const [key, value] of formDataEntries) {
		dirtyJSON = handleChildFormData(dirtyJSON, key.split(/\[/), value);
	}
	return fixedDirtyJSON(dirtyJSON);
};

const toNumber = (value) => {
	return typeof value === "number" ||
	(!Number.isNaN(Number(value)) && value !== "" && typeof value !== "boolean")
		? parseInt(value, 10)
		: value;
};

const DateNow = Date.now();

module.exports = {
	equalArrayObjects,
	diffArrayObjects,
	formDataToJSON,
	DateNow
};
