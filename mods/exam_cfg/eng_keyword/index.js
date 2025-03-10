import * as cuig from "/libs/cfg_ui_generator/index.js";

export const exam_cfg_cfg={
	name:"eng_keyword",
	author:"KagariET01",
	version:"1.0.0",
	description:"英文單字測驗產生器",
	qbook_input:"array",
	qtype_input:"KagariET01/eng_keyword:1.0.0",
	output:"array"
};

const cfgs=[
	{
		type:"number",
		display_name:"從：",
		id:"from",
		min:1,
		max:null,
		pre_value:1,
		hint:null
	},
	{
		type:"number",
		display_name:"到：",
		id:"to",
		min:1,
		max:null,
		pre_value:1,
		hint:null
	},
	{
		type:"select",
		display_name:"題目類型：",
		id:"qtype",
		list:[
			{
				type:"sublist",
				group_name:"看中文，答英文",
				list:[]
			},
			{
				type:"sublist",
				group_name:"看英文，答中文",
				list:[
					{
						type:"option",
						value:"eng2ch_choose",
						display_name:"單選題"
					}
				]
			}
		]
	},
	{
		type:"button",
		display_name:"開始考試",
		id:"start_exam"
	}
];

export async function exam_cfg(data){
	await cuig.loadHTML();
	cfgs[0].max=data.qbook.length;
	cfgs[1].max=data.qbook.length;
	cfgs[1].pre_value=data.qbook.length;
	cfgs[3].action=async(form)=>{
		let reqlist=[];
		if(form.from>form.to){
			[form.from,form.to]=[form.to,form.from];
		}
		form.from=Math.max(form.from,1);
		form.to=Math.min(form.to,data.qbook.length);
		for(let i=form.from-1;i<=form.to-1;i++){
			reqlist.push(data.qbook[i]);
		}
		data.start(reqlist);
		return;
	};
	return cuig.build_ui(cfgs);
}