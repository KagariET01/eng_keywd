
import {qtype as qtype} from "/mods/qtype/eng_keyword/index.js";


export const freader_cfg={
	name:"engbook_reader",
	author:"KagariET01",
	version:"1.0.0",
	description:"將csv單字檔轉換成json array",
	input:"csv",
	output:"array",
	output_qtype:[
		"KagariET01/eng_keyword:1.0.0"
	],
	"require":[]
};

export async function freader(file_raw){
	let file_txt=await file_raw.text();
	let re=[];
	let lines=file_txt.split("\n");
	for(let i of lines){
		let nw=i.split(",");
		if(nw.length<2)continue;
		re.push(new qtype(nw[0],nw[1]));
	}
	return re;
};
