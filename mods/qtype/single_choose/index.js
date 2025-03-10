
export const qtype={
	currect_html:(async()=>{

	})(),
	build_ui:()=>{ // 呼叫此函數，回傳一HTML，用來建構UI介面。 除非題目類型改變，否則不會重新呼叫此函數。

	},
	build_q:(q)=>{ // 呼叫此函數，更新UI介面，將題目放上去

	},
	writeans:()=>{ // 使用者回答完畢，呼叫此函數，回傳使用者的作答情況

	},
	currect:(q)=>{ // 使用者作答完畢

	},
	wrong:(q,user_ans)=>{

	}
};
