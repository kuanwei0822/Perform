$(document).ready(function(){
	
	// reset table表格
	function reset(){
		$(".dataTable").html("");
	}
	
	// 根據input處理、過濾收到的資料
	function filter(requestData){
		
		var nation_num = $("#nation").val();					
		// 宣告 nation_string 選擇的幣別(string)
		var nation_string = $("#nation option").eq(nation_num).html();
		// 宣告 nation_value 匯率資料
		var nation_value = [];
		// 宣告 time_value 月份or年份資料
		var time_value=[];
		
		// 宣告 time_type 月別or年度
		if( $("#bytime").val() == 1 ){
				var time_type = "月別";
			}else if( $("#bytime").val() == 2 ){
				var time_type = "年度";
			}
		
		for(let i=0;i<requestData.length;i++){
			// 取得匯率資料
			nation_value.push(requestData[i][nation_string]);
			
			// 取得月份/年份
			time_value.push(requestData[i][time_type]);
		}
		console.log(nation_value);	
		console.log(time_value);	
		addTable(time_value,nation_value,time_type,nation_string);
	}
	
	// 建立表格( 月別/年分Data, 匯率Data , 月別/年分string ,幣別string )
	function addTable(time_value,nation_value,time_type,nation_string){
		var tab = $("<table></table>");
		// 宣告 cul_num 行數
		var cul_num = 3;
		// 宣告 cul,row 作為表格內<tr>、<td>物件
		var row;
		var cul; 
		
		// 建立表格標頭:第一列
		row = $("<tr></td>");
		for(let i=0;i<cul_num;i++){
			if(i == 0){
				cul = $("<td></td>");
			}else if(i==1){
				cul = $("<td>"+ time_type +"</td>");
			}else if(i==2){
				cul = $("<td>"+ nation_string + "匯率" +"</td>");
			}
			row.append(cul);
		}
		
		tab.append(row);
		
		
		// 建立表格:第二列之後
		for(let i=0;i<time_value.length;i++){
			row = $("<tr></td>");
			
			// 建立表格:行(2行)
			for(let j=0;j<cul_num;j++){
			
				if(j==0){
					cul = $("<td>"+ (i+1) + "</td>");
				}else if(j==1){
					cul = $("<td>"+ time_value[i] +"</td>");	
				}else if(j==2){
					cul = ($("<td>"+ nation_value[i] +"</td>"));
				}
				row.append(cul);	// 填滿一列
			}
			
			tab.append(row);	// 將一列併入table
		}
		
		// 將 table 併入 dataTable的div內
		$(".dataTable").append(tab);	
		
		
	}
	
	
	// 送出並請求資料 
	$("#btn_sendout").click(function(){
		
		var data_url;
		var requestData;
		
		// 載入之前reset table區塊
		reset();
		
		// 防呆:避免沒有選擇任何選項，彈出視窗
		if( $("#nation").val()==0 ){
			alert("請選擇匯率國家");
			return;
		}else if( $("#bytime").val()==0 ){
			alert("請選擇時間");
			return;
		}
		
		console.log("通過防呆");
		
		// 判斷input資料 -> 決定要請求的網址:(年/月)
		if( $("#bytime").val()==1 ){
			data_url = "https://apiservice.mol.gov.tw/OdService/download/A17030000J-000049-UIv";
		}else if( $("#bytime").val()==2 ){
			data_url = "https://apiservice.mol.gov.tw/OdService/download/A17000000J-030185-ofw";
		}
		
		// 網址來源:
		// 注意:網址必須要符合CORS:* 跨域規範下可存取才有辦法取得 
		// 來源-政府資料開放平台: https://data.gov.tw/dataset/31897 
		// 國際主要國家貨幣每月匯率: https://apiservice.mol.gov.tw/OdService/download/A17030000J-000049-Ic4
		// 國際主要國家貨幣每年匯率: https://apiservice.mol.gov.tw/OdService/download/A17000000J-030185-ofw
		
		// 建立請求物件
		var request = new XMLHttpRequest();
		// 設定請求方式:get，根據input使用:data_url
		request.open("GET",data_url,true);
		// 送出請求
		request.send();
		
		// 接收資料並轉換
		request.onreadystatechange = function(){
			if( request.readyState==4){
				if(request.status == 200 ){
					console.log("v讀取成功");
					// 轉換得到的JSON資料
					requestData = JSON.parse(request.response);
					console.log(requestData);
					filter(requestData);
					
				}
			}
		}
	})
	
	// Reset 按鈕
	$("#btn_reset").click(function(){
		reset();
		
		// 加入尚無載入資料字樣
		var default_obj =$("<p></p>");
		default_obj.html("尚無載入資料");
		$(".dataTable").append(default_obj);
	})
	
})