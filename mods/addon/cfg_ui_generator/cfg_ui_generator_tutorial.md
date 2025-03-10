# 檔案開頭

- `root` `list<q>` 問題列表

# 表單類型(q)

## global

- `(root)` `object` `(=q)` 問題object，內含該問題的cfg
	- `type` `string` 問題類型，告知程式這個問題是什麼類型，來給予適合的作答方式
	- `display_name` `string` 顯示名稱，會顯示在輸入框左邊
	- `id` `string` 問題id，當使用者輸入答案時，會在紀錄回復的object中使用此id來對應答案
	- `pre_value` `any` 預設值，會被預先填入輸入框
	- `hint` `string|null` 提示文字，在輸入前會以較淡的顏色顯示在輸入框內，當使用者開始輸入後會消失
	- `readonly` `boolean` 是否唯讀，當為`true`時，使用者無法更改答案

## folder

可把問題分類，折疊成一個區塊

- `(root)` `object`
	- `type` `"folder"`
	- `display_name` `string` 區塊名稱
	- `list` `list<q>` 此區塊內的問題

## button
- `(root)` `object`
	- `type` `"button"`
	- `display_name` `string` 按鈕名稱
	- `action` `function` 按下按鈕後的動作
		- 傳入值
			- `value` `null|any` 表單的內容，當`read_form`為`true`時，會讀取表單的內容，並將內容傳入`action`中，否則會傳入 `null`
	- `read_form` `boolean` 是否讀取表單，當為`true`時，按下按鈕後會讀取表單的內容，並將內容傳入`action`中

## text

小小的文字框，用於輸入少量文字

- `(root)` `object`
	- `type` `"text"`

return: `string`

## textarea

future

<!--
可以換行的文字輸入框，用於需要輸入大量內容的問題

- `q` `object`
	- `type` `"textarea"`

return: `string`
-->

## number

數字輸入框，此時輸入框會被設定只能輸入數字

- `(root)` `object`
	- `type` `"number"`
	- `min` `number` (future)最小值
	- `max` `number` (future)最大值
	- `step` `number` 每次增加或減少的數值

return: `number`

## select

下拉式選單，提供一些預先提供的選項，讓使用者選擇

- `(root)` `object`
	- `type` `"select"`
	- `list` `list<string|object>` `(=option_list)` 選項列表
		- case1: `list<string>` 單一選項
			- `string` 選項，會顯示給用戶，當用戶選擇此選項時，會使用此字串作為回傳值
		- case2: `object` 單一選項
			- `type` `string` object類型，請填入`"option"`
			- `value` 選擇此選項後，要回傳的值
			- `display_name` 顯示給用戶的選項
		- case3: `object` 子選項列表
			- `type` `string` object類型，請填入`"sublist"`
			- `group_name` `string` 群組名稱，會顯示在選項上方
			- `list` `option_list` 選項列表
	- `allow_other` `boolean` (future)是否允許使用者輸入其他選項
	- `other_display_name` `string` (future)會使用這個新選項來顯示"其他"輸入區
	- `other_input` `q` (future)其他選項的問題object，當`allow_other`為`true`時，且使用者選擇了其他選項，會顯示此問題

return: `string`

## file

檔案上傳，使用者可以上傳檔案

- `(root)` `object`
	- `type` `"file"`

return: `file`

## multiple

future

<!--

複選框，使用者可以選擇多個選項

- `(root)` `object`
	- `type` `"multiple"`
	- `options` `list<string>` 選項列表
	- `allow_other` `boolean` 是否允許使用者輸入其他選項
	- `other_display_name` `string` 會使用這個新選項來顯示"其他"輸入區
	- `other_input` `q` 其他選項的問題object，當`allow_other`為`true`時，且使用者選擇了其他選項，會顯示此問題

return: `list<string>`

-->

## date

future

## time

future

## datetime

future

## range

future

## color

future

## email

future


