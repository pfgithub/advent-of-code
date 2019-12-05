let go = mass => {
	return Math.floor(mass / 3) - 2;
};
output = input
	.split("\n")
	.map(q => +q)
	.map(q => go(q))
	.reduce((a, b) => a + b, 0);
