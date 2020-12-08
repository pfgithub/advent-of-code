export {};

let card_index = 101423746548312;
const card_count = 119315717514047;

// 2020 → 76041352231315 → 101423746548312 → 42049092962045

// lines = `deal into new stack`.split("\n");

for(const line of lines) {
	if(line == "deal into new stack") {
		card_index = card_count - card_index - 1;
	}else if(line.startsWith("cut ")) {
		let [a, b] = line.split(" ");
		let ncards =+ b;
		if(ncards > 0) {
			if(card_index >= ncards) {
				card_index -= ncards;
			}else{
				card_index += (card_count - ncards);
			}
		} else {
			if(card_index >= (card_count + ncards)) {
				card_index -= (card_count + ncards);
			}else{
				card_index -= ncards;
			}
		}
	}else if(line.startsWith("deal with increment ")) {
		const [, , , v] = line.split(" ");
		card_index *=+ v;
		card_index %= card_count;
	}else{
		console.log(line);
		break;
	}
}
console.log(card_index);