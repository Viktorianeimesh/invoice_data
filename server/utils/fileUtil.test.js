const { generateDirectories } = require("./fileUtil");
describe("fileUtil", () => {
	test("generateDirectories correct 1", () => {
		const result = generateDirectories("fdb5179a890546aa9f14d3edcd4bf0cb");
		expect(result).toEqual([
			"fd",
			"b5",
			"17",
			"9a",
			"89",
			"05",
			"46",
			"aa",
			"9f",
			"14",
			"d3",
			"ed",
			"cd",
			"4b",
			"f0",
			"cb"
		]);
	});
});
