import * as roles from "./libs/mods/index.js";


const speaker=window.speechSynthesis;

async function tts(txt){
	if(speaker.speaking){
		speaker.cancel();
	}
	if(txt.length){
		speaker.speak(new SpeechSynthesisUtterance(txt));
	}
}

let keybook_list=await new Promise((resolve,reject)=>{
	let f=fetch("./keybooks/list.json");
	f.then((res)=>{
		if(res.ok){
			res.json().then((data)=>{
				resolve(data);
			});
		}else{
			console.error("404 keybook_list.json not found.");
			// window.alert("404 keybook_list.json not found.");
			reject("404");
		}
	});
});


function object2list(obj){
	let lst=[];
	for(let i in obj){
		lst.push(i);
	}
	return lst;
}

document.getElementById("keybk_list").innerHTML=(()=>{
	let keybk_list=object2list(keybook_list);
	let re="";
	for(let i=0;i<keybk_list.length;i++){
		re+=`<option value="${keybk_list[i]}">${keybk_list[i]}</option>`;
	}
	return re;
})();

document.getElementById("mods").innerHTML=(()=>{
	let mods_list=object2list(roles);
	let re="";
	for(let i=0;i<mods_list.length;i++){
		let nw=new roles[mods_list[i]]().name;
		// nw=nw.name;
		re+=`<option value="${mods_list[i]}">${nw}</option>`;
	}
	return re;
})();

function reset(v){ // 0:setting, 1:testing
	document.getElementById("st").disabled=v;
	document.getElementById("ed").disabled=v;
	document.getElementById("start").disabled=v;
	document.getElementById("file").disabled=v;
	document.getElementById("upload").disabled=v;
	document.getElementById("keybk_list").disabled=v;
	document.getElementById("choose_keybk").disabled=v;
	document.getElementById("mods").disabled=v;
	document.getElementById("ans").disabled=!v;
	document.getElementById("submit").disabled=!v;
	document.getElementById("download").disabled=false;
}
reset(0);
let keywd=[];

async function filereader_txt_v1(txt){
	let keywd=[];
	keywd=txt.split("\n");
	keywd=keywd.map((x)=>x.trim());
	keywd=keywd.map((x)=>x.split(","));
	let del_list=[];
	for(let i in keywd){
		if(keywd[i].length<2){
			del_list.push(i);
		}
	}
	for(let i=del_list.length-1;i>=0;i--){
		keywd.splice(del_list[i],1);
	}
	return keywd;
}

async function filereader_row_file_v1(file){
	let reader=new FileReader();
	let text=await file.text();
	// keywd=text.split("\n");
	// keywd=keywd.map((x)=>x.trim());
	// keywd=keywd.map((x)=>x.split(","));
	// console.log(keywd);
	return filereader_txt_v1(text);
}


async function set_range(){
	// document.getElementById("ed").ariaValueMin=1;
	document.getElementById("ed").ariaValueMax=keywd.length;
	document.getElementById("ed").value=keywd.length;
	// document.getElementById("st").ariaValueMin=1;
	document.getElementById("st").ariaValueMax=keywd.length;
	document.getElementById("st").value=1;
}

document.getElementById("upload").addEventListener("click",async()=>{
	reset(0);
	let file=document.getElementById("file").files[0];
	keywd=await filereader_row_file_v1(file);
	set_range();
});

document.getElementById("choose_keybk").addEventListener("click",async()=>{
	reset(0);
	let keybk=document.getElementById("keybk_list").value;
	let keywd_path=keybook_list[keybk];
	let keywd_txt=await new Promise((resolve,reject)=>{
		let f=fetch(keywd_path);
		f.then((res)=>{
			if(res.ok){
				resolve(res.text());
			}else{
				window.alert("404 keybook not found.");
				reject("404");
			}
		});
	});
	keywd=await filereader_txt_v1(keywd_txt);
	set_range();
});



async function start(){
	let status={};
	status.tts=tts;
	status.keybook=keywd;

	if(!status.keybook || status.keybook.length===0){
		window.alert("no keybook");
		return;
		throw "no keybook";
	}
	status.st=1;
	if(document.getElementById("st").value){
		status.st=document.getElementById("st").value;
	}
	document.getElementById("st").readOnly=true;
	status.ed=keywd.length;
	if(document.getElementById("ed").value
		&&document.getElementById("ed").value
		<keywd.length){
		status.ed=document.getElementById("ed").value;
	}
	document.getElementById("ed").readOnly=true;
	if(status.st>status.ed){
		swap(status.st,status.ed);
	}

	if(!document.getElementById("mods").value){
		window.alert("no mods, please choose one mode before the test.");
		return;
	}
	let mod=document.getElementById("mods").value;
	if(!roles[mod]){
		window.alert("404 no such mode.");
		return;
	}
	status.wronglist=null;
	document.getElementById("download").addEventListener("click",async()=>{
		let text=status.wronglist;
		if(!text){
			window.alert("no wrong keywd");
			return;
		}
		let blob=new Blob([text],{type:"text/plain"});
		let url=URL.createObjectURL(blob);
		let a=document.createElement("a");
		a.href=url;
		a.download="keybook.csv";
		a.click();
	})
	
	// choose question type

	let qsys=new roles[mod](status);





	reset(1);
	
	while(1){
		try{
			document.getElementById("status").textContent=qsys.get_status();
			document.getElementById("ans").value="";
			let question=qsys.show_question();
			document.getElementById("Q").innerHTML=question;
			let ans="";
			let res=false;
			while(1){
				try{
					ans=await new Promise((resolve,reject)=>{
						document.getElementById("submit").addEventListener("click",()=>{
							resolve(document.getElementById("ans").value);
						});
						document.getElementById("ans").addEventListener("keydown",(e)=>{
							if(e.key==="Enter"){
								resolve(document.getElementById("ans").value);
							}
						});
					});
					res=qsys.check_ans(ans);
					break;
				}catch(e){
					if(e=="input error"){
						document.getElementById("ans").value="";
						continue;
					}else throw e;
				}
			}
			if(res){
				document.getElementById("download").disabled=false;
				await new Promise((resolve)=>{
					window.alert(res);
					resolve();
				});
			}
		}catch(e){
			if(e==="end"){
				document.getElementById("Q").textContent="testing ending.";
				reset(0);
				qsys.ending();
				break;
			}else{
				throw(e);
				break;
			}
		}
	}

}


document.getElementById("start").addEventListener("click",start);
