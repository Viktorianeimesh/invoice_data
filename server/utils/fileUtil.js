const generateDirectories = (hash) => {
	const divider = 16;
	const len = hash.length;
	if (len % divider !== 0) {
		return [];
	}
	const arrLen = len / divider;
	return new Array(divider).fill().map((_, index) => hash.slice(index * arrLen, index * arrLen + arrLen));
};

module.exports = {
	generateDirectories
};
