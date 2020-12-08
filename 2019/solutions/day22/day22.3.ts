export {};

// :: part 2
// need to track the card in position 2020, not track a card with a given number:

// 0…a lot
// deal with increment :: get the card at index …
// how about doing this backwards

// lines = `deal into new stack`.split("\n");

// at position 2020: ← deal with increment 12 : at position ?? ← deal into new stack : at position (pos - pos - 1) : cut ← at position …

// expected: 1545 @pos 2019
// expected: 2019 @pos 8191

// let card_index = 8191;
let card_index = 5;
// let card_count = 10007;
let card_count = 10;

lines = `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`.split("\n");


function mod(v: number, n: number) {
    return ((v%n)+n)%n;
};

for(const line of lines.reverse()) {
	if(line == "deal into new stack") {
		card_index = card_count - card_index - 1;
	}else if(line.startsWith("cut ")) {
		let [a, b] = line.split(" ");
		let ncards =+ b;
		if(ncards > 0) {
			if(card_index < card_count - ncards) {
				card_index += ncards;
			}else{
				card_index -= card_count;
				card_index += ncards;
			}
		} else {
			ncards =- ncards;
			if(card_index < ncards) {
				card_index += card_count - ncards;
			}else{
				card_index -= ncards;
			}
		}
	}else if(line.startsWith("deal with increment ")) {
		const [, , , v] = line.split(" ");
		const incr =+ v;
		// 0→0, 1→7, 2→4,  3→1, 4→8, 5→5,  6→2 …
		// https://www.desmos.com/calculator/wh1c6hwe02
		const b = incr;
		const c = card_count;
		card_index = mod((-b) * (card_index), c);
        if(incr == card_count - 1) {
            if(card_index == 0) continue;
            card_index = card_count - card_index;
        }
	}else{
		console.log(line);
		break;
	}
}
console.log(card_index);
