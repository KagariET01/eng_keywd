export class ch2en{
	name="see chinese, input english";
	status={};
	constructor(status=null){
		if(!status){
			return this.name;
		}
		this.status=status;
		status.wronglist="";
		this.status.i=status.st-1;
		this.status.wrongcnt=0;
	}
	show_question(){ // return a question
		if(this.status.i>=this.status.ed){
			throw "end";
		}
		// this.status.keybook=keywd;
		this.status.question=this.status.keybook[this.status.i];
		this.status.tts(this.status.question[0]);
		return this.status.question[1];
	}
	get_status(){
		return `now:${this.status.i+1}, wrong:${this.status.wrongcnt}`;
	}
	check_ans(ans){
		ans=ans.trim();
		if(!ans){
			throw "input error";
		}
		if(ans===this.status.question[0].trim()){
			this.status.i++;
			return false;
		}else{
			this.status.wrongcnt++;
			this.status.wronglist+=this.status.keybook[this.status.i][0]+",";
			this.status.wronglist+=this.status.keybook[this.status.i][1]+"\n";
			this.status.i++;
			return `[WRONG!] ${this.status.question[1]} = ${this.status.question[0]}`;
		}
	}
	ending(){

	};
};