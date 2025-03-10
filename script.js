
















export let test="test123";


// ==========[button action]==========
export function changeFileType(){
	const ftype_value=document.getElementById('file_type').value;
	if(ftype_value=="costom"){
		document.getElementById("book_type_file").style.display="block";
	}else{
		document.getElementById("book_type_file").style.display="none";
	}
}











