const dobit = (set: {[key: string]: string}) => {
	return lines.map(line => [...line].map(q => {
		if(+q) return "Cheat("+q+")";
		if(set[q]) return set[q]; 
		return q;
	}).join("")).map(v => "("+v+")").join("+");
};

copy(`
print('Part 1:', (${dobit({"*":"-"})}), "\\nPart 2:", (${dobit({"*":"-", "+": "%"})}))
`);