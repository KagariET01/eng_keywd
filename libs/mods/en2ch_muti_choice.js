export class en2ch_muti_choice{
	name="see english, choose chinese";
	status={};
	choice_count=6;
	try_time=1000;
	lcs_ver=0.2;
	use_lcs=true;
	new_bag(){
		// console.log("new_bag");
		let num=this.status.keybook.length;
		let re=[];
		for(let i=0;i<num;i++){
			re.push(i);
		}
		re=re.sort(()=>Math.random()-0.5);
		// console.log(re);
		this.status.random_bag=re;
	}
	constructor(status=null){
		if(!status){
			return this.name;
		}
		this.status=status;
		if(status.keybook.length<=1){
			window.alert("keybook too short, you need at least 2 keywords that can make 2 (or more) choices for each question.");
			throw "keybook too short";
		}
		this.choice_count=Math.min(this.choice_count,status.keybook.length);
		this.try_time=Math.min(this.try_time,status.keybook.length);
		status.wronglist="";
		this.status.i=status.st-1;
		this.status.wrongcnt=0;
		document.getElementById("ans").type="number";
		this.status.random_bag=[];
		this.new_bag();
	}
	lcs(a,b){
		let dp=new Array(a.length+1);
		for(let i=0;i<=a.length;i++){
			dp[i]=new Array(b.length+1).fill(0);
		}
		for(let i=1;i<=a.length;i++){
			for(let j=1;j<=b.length;j++){
				if(a[i-1]===b[j-1]){
					dp[i][j]=dp[i-1][j-1]+1;
				}else{
					dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);
				}
			}
		}
		return dp[a.length][b.length];
	}
	show_question(){ // return a question
		if(this.status.i>=this.status.ed){
			throw "end";
		}
		this.choice_list=[];
		this.status.ans=Math.random()*this.choice_count|0;
		for(let i=0;i<this.choice_count;i++){
			if(i===this.status.ans){
				this.choice_list.push(this.status.keybook[this.status.i][1]);
				this.status.ans=i;
			}else{
				let a=null;
				let tt=0;
				while(1){
					if(tt>this.try_time && !this.use_lcs){
						a="";
						break;
					}
					if(tt>this.try_time){
						this.use_lcs=false;
						tt=0;
						// console.log("try too many times, cancel lcs.");
					}
					tt++;
					if(!this.status.random_bag.length){
						this.new_bag();
					}
					let c=true;
					a=this.status.keybook[this.status.random_bag[this.status.random_bag.length-1]][1];
					this.status.random_bag.pop();
					for(let j in this.choice_list){
						// console.log(a,this.choice_list[j]);
						if(a===this.choice_list[j]){
							c=false;
							break;
						}
						if(this.use_lcs && this.lcs(a,this.choice_list[j])>=Math.max(a.length,this.choice_list[j])*this.lcs_ver){
							c=false;
							break;
						}
					}
					if(!c){
						continue;
					}
					if(a===this.status.keybook[this.status.i][1]){
						continue;
					}
					if(this.use_lcs && this.lcs(a,this.status.keybook[this.status.i][1])>=Math.max(a.length,this.status.keybook[this.status.i][1].length)*this.lcs_ver){
						continue;
					}
					break;
				}
				if(a){
					this.choice_list.push(a);
				}
			}
		}

		this.status.question=this.status.keybook[this.status.i];
		let re="";
		re+="<p>"+this.status.question[0]+"</p>";
		re+="<ol start=\"0\">";
			re+=`<li>play voice</li>`;
		for(let i=0;i<this.choice_list.length;i++){
			re+=`<li>${this.choice_list[i]}</li>`;
		}
		re+="</ol>"
		this.status.tts(this.status.question[0]);
		return re;
	}
	get_status(){
		return `now:${this.status.i+1}, wrong:${this.status.wrongcnt}`;
	}
	check_ans(ans){
		ans=ans.trim();
		ans=Number(ans);
		if(ans===0){
			this.status.tts(this.status.question[0]);
			throw "input error";
		}
		if(!ans || ans<=0 || ans>this.choice_list.length || !Number.isInteger(ans)){
			window.alert(`input error, please input a integer between 1 and ${this.choice_count}`);
			throw "input error";
		}
		ans--;
		if(ans===this.status.ans){
			this.status.i++;
			return false;
		}else{
			this.status.wrongcnt++;
			this.status.wronglist+=this.status.keybook[this.status.i][0]+",";
			this.status.wronglist+=this.status.keybook[this.status.i][1]+"\n";
			this.status.i++;
			this.status.tts(`${this.status.question[0]} should be ${this.status.question[1]}`);
			return `[WRONG!] ${this.status.question[0]} = [${this.status.ans+1}] ${this.status.question[1]}`;
		}
	}
	ending(){

	};
};