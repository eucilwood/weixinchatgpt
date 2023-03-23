// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129

const db = uniCloud.database();
module.exports = {
	_before: function () { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	/* 
	method1(param1) {
		// 参数校验，如无参数则不需要
		if (!param1) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '参数不能为空'
			}
		}
		// 业务逻辑
		
		// 返回结果
		return {
			param1 //请根据实际需要返回值
		}
	}
	*/
   getToken:async function(){
	   const res = await uniCloud.httpclient.request(
	   	'https://api.weixin.qq.com/cgi-bin/token', {
	   		method: 'GET',
	   		data: {
	   			content: content
	   		},
	   		contentType: 'json', // 指定以application/json发送data内的数据
	   		dataType: 'json' // 指定返回值为json格式，自动进行parse
	   	})
   },
 checkText: async function(access_token, content) {
 		const res = await uniCloud.httpclient.request(
 			'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' + access_token, {
 				method: 'POST',
 				data: {
 					content: content
 				},
 				contentType: 'json', // 指定以application/json发送data内的数据
 				dataType: 'json' // 指定返回值为json格式，自动进行parse
 			})
 		if (res.status === 200 && res.data.errcode === 0) {
 			return {
 				code: 0,
 				msg: '没有敏感词'
 			}
 		} else {
 			return {
				res,
 				code: -1,
 				msg: '含有敏感词'
 			}
 		}
 	},
	add:(openid)=>{
			 db.collection("uni-id-log").where(user_id=="${openid}").get().then((res)=>{
				 return {
					 res:res,
					 openid:openid
				 }
			 })
		}


}
