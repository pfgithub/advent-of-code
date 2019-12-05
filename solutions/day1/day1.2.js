let go = mass => {
	let res = Math.floor(mass / 3) - 2;
	if (res < 0) return 0;
	return res + go(res);
};

output = input
	.split("\n")
	.map(q => +q)
	.map(q => go(q))
	.reduce((a, b) => a + b, 0);
