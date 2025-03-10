export const qtype_cfg={
	name:"eng_keyword",
	author:"KagariET01",
	version:"1.0.0",
	description:"單個英文單字"
};

export class qtype{
	/**
	 * @param {string} eng 英文單字
	 * @param {string} ch 中文解釋
	 */
	eng="";
	ch="";
	constructor(eng="",ch=""){
		this.eng=eng;
		this.ch=ch;
	}
};
