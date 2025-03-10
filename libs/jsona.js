
export async function tojsona(obj){
	let threads=[];
	let re={};
	if(typeof obj==="list"){
		re.type="list";
		re.data=[];
		re.data.resize(obj.length);
		for(let i in obj){
			// threads.push(new Promise((resolve)=>{
			// 	re.data[i]=await tojsona(i);
			// 	resolve();
			// }));
			threads.push((async()=>{
				re.data[i]=await tojsona(obj[i]);
			})());
		}
	}else if(typeof obj==="object"){
		re.type="object";
		re.data={};
		for(let i in obj){
			// threads.push(new Promise((resolve)=>{
			// 	re.data[i]=tojsona(obj[i]);
			// 	resolve();
			// }));
			threads.push((async()=>{
				re.data[i]=await tojsona(obj[i]);
			})());
		}
	}else if(typeof obj==="function"){
		re.type="function";
		re.data=obj.toString();
	}else{
		re.type="value";
		re.data=obj;
	}
	for(let i of threads){
		await i;
	}
	return re;
};

export async function toobj(jsona){
	let threads=[];
	let re=null;
	if(jsona.type==="list"){
		re=[];
		re.resize(jsona.data.length);
		for(let i in jsona.data){
			// threads.push(new Promise((resolve)=>{
			// 	re[i]=toobj(jsona.data[i]);
			// 	resolve();
			// }));
			threads.push((async()=>{
				re[i]=await toobj(jsona.data[i]);
			})());
		}
	}else if(jsona.type==="object"){
		re={};
		for(let i in jsona.data){
			// threads.push(new Promise((resolve)=>{
			// 	re[i]=toobj(jsona.data[i]);
			// 	resolve();
			// }));
			threads.push((async()=>{
				re[i]=await toobj(jsona.data[i]);
			})());
		}
	}else if(jsona.type==="function"){
		re=eval(`(${jsona.data})`);
	}else if(jsona.type==="value"){
		re=jsona.data;
	}
	for(let i of threads){
		await i;
	}
	return re;
};
