// loading UI from file



let UI={};
let UIlist=[
	"folder",
	"input_bar",
	"select_list",
	"file",
	"button"
];

export const addon_cfg={
	name:"cfg_ui_generator",
	author:"KagariET01",
	version:"1.0.0",
	description:"讀取json，自動化產出UI"
};

export async function loadHTML(){
	let threads=[];
	for(let i of UIlist){
		threads.push((async()=>{
			UI[i]=await fetch(`./libs/cfg_ui_generator/type/${i}.html`).then((response)=>response.text());
		})());
	}
	for(let i of threads){
		await i;
	}
};


// ...existing code...

export async function build_ui(cfg,idname="bui"){
	if(!UI || !UI.length)
		await loadHTML();
	let re=document.createElement("div");
	let submit_action=[];
	let getvalue={fn:()=>{}};
	for(let i of cfg){
		let nw=document.createElement("div");
		console.log(i);
		if(i.type=="folder"){
			let nwhtmlraw=UI["folder"];
			nwhtmlraw=nwhtmlraw.replaceAll("${name}",i.display_name);
			nw.innerHTML=nwhtmlraw;
			let subui=build_ui(i.list,`idname_${i.id}`);
			nw.querySelector("#input").innerHTML+=subui.html.innerHTML;
			submit_action.push((reobject)=>{
				reobject[i.id]=null;
				reobject[i.id]=subui.getvalue();
			});
		}else if(i.type=="text"){
			let nwhtmlraw=UI["input_bar"];
			nwhtmlraw=nwhtmlraw.replaceAll("${name}",i.display_name);
			nw.innerHTML=nwhtmlraw;
		}else if(i.type=="number"){
			let nwhtmlraw=UI["input_bar"];
			nwhtmlraw=nwhtmlraw.replaceAll("${name}",i.display_name);
			nw.innerHTML=nwhtmlraw;
			nw.querySelector("#input").type="number";
			if(i.min)
				nw.querySelector("#input").min=i.min;
			if(i.max)
				nw.querySelector("#input").max=i.max;
			if(i.step)
				nw.querySelector("#input").step=i.step;
		}else if(i.type=="select"){
			let nwhtmlraw=UI["select_list"];
			nwhtmlraw=nwhtmlraw.replaceAll("${name}",i.display_name);
			nw.innerHTML=nwhtmlraw;
			function build_select_list(list){
				let re=document.createElement("select");
				for(let j of list){
					if(typeof(j)=="object"){
						if(j.type=="option"){
							let nwop=document.createElement("option");
							nwop.value=j.value;
							nwop.innerHTML=j.display_name;
							re.appendChild(nwop);
						}else if(j.type=="sublist"){
							let nwop=document.createElement("optgroup");
							nwop.label=j.group_name;
							nwop.innerHTML=build_select_list(j.list);
							re.appendChild(nwop);
						}
					}else{
						let nwop=document.createElement("option");
						nwop.value=j;
						nwop.innerHTML=j;
						re.appendChild(nwop);
					}
				}
				return re.innerHTML;
			}
			nw.querySelector("#input").innerHTML=build_select_list(i.list);
		}else if(i.type=="file"){
			let nwhtmlraw=UI["file"];
			nwhtmlraw=nwhtmlraw.replaceAll("${name}",i.display_name);
			nw.innerHTML=nwhtmlraw;
			// nw.querySelector("#input").type="file";
		}else if(i.type=="button"){
			let nwhtmlraw=UI["button"];
			nwhtmlraw=nwhtmlraw.replaceAll("${name}",i.display_name);
			nw.innerHTML=nwhtmlraw;
			nw.querySelector("#input").addEventListener("click",()=>{
				i.action(getvalue.fn());
			});
		}



		if(i.pre_value)
			nw.querySelector("#input").value=i.pre_value;
		if(i.hint)
			nw.querySelector("#input").placeholder=i.hint;
		if(i.readonly)
			nw.querySelector("#input").disabled=true;

		if(i.id){
			nw.querySelector("#input").id=`${idname}_${i.id}`;
			if(i.type!="file"){
				submit_action.push((reobject)=>{
					reobject[i.id]=null;
					reobject[i.id]=nw.querySelector(`#${idname}_${i.id}`).value;
				});
			}
		}else{
			nw.querySelector("#input").id="";
		}
		console.log(nw);
		re.innerHTML+=nw.innerHTML;
		// re.appendChild(nw);
	}

	console.log(re);
	c=re;
	getvalue.fn=()=>{
		let reobject={};
		for(let i of submit_action){
			i(reobject);
		}
		return reobject;
	};
	return {
		html:re.innerHTML,
		html:re,
		getvalue:getvalue.fn
	};
}
