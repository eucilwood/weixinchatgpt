<template>
	<view class="content">
		<!-- <ad-interstitial adpid="adunit-01a2e69817c90316"></ad-interstitial> -->
		<!-- <ad adpid="adunit-01a2e69817c90316"></ad> -->
		<view class="topbox">
		<!-- 	<view class="title">
				神奇海螺
			</view> -->
			<view class="imghmpdxbox">
				<img src="@/static/hm3.png" alt="" srcset="" class="hmbb">
					<img src="@/static/pdx.png" alt="" srcset="" class="pdx">
						<img src="@/static/xlb.png" alt="" srcset="" class="xlb">
						<img src="@/static/zyg.png" alt="" srcset="" class="zyg">
			</view>
			<view class="sharecontent">
				<view class="useSum">
					每日使用次数:{{count}}
				</view>
				<view class="share">
					<view class="text">
						每日分享次数({{sharecount}}/5)
					</view>
					<view class="sharebutton">
						<button @click="shareAddSubtract" open-type="share" class="sharebox" style="margin-left: auto;margin-right: 5px;">分享</button>
						<button @click="showEncourageAd" class="sharebox">观看广告</button>
					</view>
				</view>
			</view>


			<!-- 申请商户中..... -->
			<!-- 		<view class="pay">
				<view class="payitem1" @click="payfn">
					<button>1元/2次</button>
				</view>
				<view class="payitem1">
					<button>5元/10次</button>
				</view>
				<view class="payitem1">
					<button>10元/20次</button>
				</view>
			</view> -->
		</view>
		<view class="messagebox">
			<view class="block" v-for="item in messageList"
				:class="{'left':item.from==='chatgpt','right':item.from==='my'}">
				<img src="@/static/hm.png" alt="" v-if="item.from==='chatgpt'" class="imgbox">
				<view class="messageItem">
					<view style="text-align: left;"> {{item.info}}</view>
				</view>
			</view>
		</view>
		<view class="messageInput">
			<input type="text" v-model="message" class="inputItem" placeholder="请遵守相关法律,敏感词已屏蔽!">
			<button @click="sendMessage" class="messageButtonBox" :loading="loading">
				发送
			</button>

		</view>
	</view>
</template>

<script setup lang="ts">
	import hmimg from '@/static/hm.png'
	// import interstitial from './untils.js'
	import {
		onMounted,
		reactive,
		ref
	} from "vue";
	import {
		onLoad,
		onShareAppMessage,
		onShow,
	} from "@dcloudio/uni-app"
	// 云对象
	const checkContent = uniCloud.importObject("checkContent")
	// 云数据库
	const db = uniCloud.database();
	const token = uni.getStorageSync('token')
	onShow(() => {
		console.log('appshow')
	})
	onMounted(() => {
		// 是否登录过
		const res = uni.getStorageSync('token')
		if (!res) {
			login()
		} else {
			userInfo(res)
		}

		loadad()
		showAd()
		// uni.createSelectorQuery().select(".messagebox").boundingClientRect((res)=>{
		//     console.log(res,'---res')
		//     let newbottom = res.bottom+res.height
		//     uni.pageScrollTo({
		//         duration: 100,// 过渡时间
		//         scrollTop: newbottom+1000,// 滚动的实际距离
		//     })
		// }).exec();
	})
	// 插屏广告
	let interstitialAd = null;
	// 激励广告
	let interstitialEncourageAd = null;
	const loadad = async () => {
		if (uni.createInterstitialAd) {
			interstitialAd = uni.createInterstitialAd({
				adUnitId: 'adunit-01a2e69817c90316'
			})
			interstitialEncourageAd = uni.createRewardedVideoAd({
				adUnitId: 'adunit-bc43d546ecab1ed0'
			})

			interstitialAd.onLoad(() => {
				console.log('插屏 广告加载成功')
			})
			interstitialAd.onError((err) => {
				console.log('插屏 广告加载失败', err)
			})
			interstitialAd.onClose((res) => {
				console.log('插屏 广告关闭', res)
			})
			// 激励
			interstitialEncourageAd.onLoad(() => {
				console.log('激励 广告加载成功')
			})
			interstitialEncourageAd.onError((err) => {
				console.log('激励 广告加载失败', err)
			})
			interstitialEncourageAd.onClose(async (res) => {
				console.log('激励 广告关闭', res)
				// 广告看完
				if (res.isEnded) {
					const res = await db.collection("uni-id-log").where({
						user_id: token
					})
					let count = 0
					await res.get().then((rep) => {
						count = rep.result.data[0].user_count
					})
					await res.update({
						user_count: count + 2,
					})
					uni.showToast({
						title: '观看成功,提问次数+2'
					})
					userInfo(token)
				}

			})
		}
	}
	const showAd = () => {
		if (interstitialAd) {
			interstitialAd.show().catch((err) => {
				console.error(err)
			})
		}
	}
	const showEncourageAd = () => {
		console.log('激励')
		if (interstitialEncourageAd) {
			interstitialEncourageAd.show().catch((err) => {
				console.error(err)
			})
		}
	}

	onLoad(() => {

	})
	onShareAppMessage(() => {
		isShare.value = true
		return {
			title: '为什么不问一问神奇海螺呢',
			imageUrl: hmimg,
			success: function(res) {
				uni.showToast({
					title: '分享成功'
				})
			},
			fail: function(res) {
				// 转发失败
				console.log(res)
			}


		}
	})


	onShow(() => {
		wx.updateShareMenu({
			withShareTicket: true,
			success() {}
		})
		if (isShare.value) {
			uni.showToast({
				title: '分享成功！'
			})
			isShare.value = false
		}

	})

	// 用户使用次数
	const count = ref(0)
	// 每天分享次数24小时刷新
	const sharecount = ref(0)
	const login_code = ref('')
	// 聊天框内容
	const message = ref('')
	// 发送按钮loading
	const loading = ref(false)
	// 聊天列表
	const messageList = reactive([
		{from:'chatgpt',info:'hi,我是神奇海螺🐚你有什么问题想问我吗？'}
	])
	// 配合onshow判断是否进入分享界面
	const isShare = ref(false)
	interface userinfo {
		openid: string
	}
	//用户信息
	const userInfo = async (id) => {
		db.collection("uni-id-log").get().then(async (res) => {
			console.log(res.result.data)
			let obj = res.result.data.find(item => item.user_id === id)
			if (obj === undefined) {
				// 新用户
				db.collection("uni-id-log").add({
					user_id: id,
					// 每个用户有10次提问
					user_count: 10,
					// 每天分享次数,
					share_count: 5,
					// 记录时间24小时刷新每天分享次数
					date: new Date().getTime()
				})
			} else {
				count.value = res.result.data[0].user_count
				sharecount.value = res.result.data[0].share_count
				let dbDate = res.result.data[0].date
				if (dbDate + 86400000 < (new Date().getTime())) {
					// 过了24小时，每日分享次数刷新
					const res = await db.collection("uni-id-log").where({
						user_id: token
					}).update({
						share_count: 5
					})

				}

			}
		})
	}
	const login = () => {
		uni.login({
			provider: 'weixin',
			success: res => {
				console.log(res)
				login_code.value = res.code // 获得的code
				uni.request({
					method: 'GET',
					url: "https://api.weixin.qq.com/sns/jscode2session",
					data: {
						secret: "8ed1aad06f34363979cdb055965d7177",
						appid: "wx31001c9ca057a395",
						grant_type: "authorization_code",
						js_code: res.code
					},
					success: (res) => {
						uni.showToast({
							title: '登录成功'
						})
						userInfo(res.data.openid)
						uni.setStorageSync('token', res.data.openid);
					}
				})
			}
		});
	}
	// true 增加 fasle减少
	const shareAddSubtract = async (type = true) => {
		const res = await db.collection("uni-id-log").where({
			user_id: token
		})
		let count = 0
		let sharecount = 0
		await res.get().then((rep) => {
			console.log(rep)
			count = rep.result.data[0].user_count
			sharecount = rep.result.data[0].share_count
		})

		if (type) {
			await res.update({
				user_id: token,
				user_count: count + 1,
				share_count: sharecount - 1 < 0 ? 0 : sharecount - 1
			})
			uni.showToast({
				title: '分享成功,提问次数+1'
			})
		} else {
			if (count === 0) return
			await res.update({
				user_id: token,
				user_count: count - 1
			})
		}

		// 重新调用户信息
		userInfo(token)
	}

	const sendMessage = async () => {
		console.log('发送消息----')
		if (!message.value) return
		if (count.value <= 0) {
			uni.showToast({
				title: '次数已用完',
				icon: 'error'
			})
			messageList.push({
				from: 'chatgpt',
				info: '你的次已经使用完,观看广告可以获得2次提问机会哦！'
			})
			return
		}
		if (message.value === '') {
			uni.showToast({
				title: '请先输入内容',
				icon: 'error'
			})
			return
		}
		loading.value = true
		// 检测敏感词
		uni.request({
			method: 'GET',
			url: "https://api.weixin.qq.com/cgi-bin/token",
			data: {
				secret: "8ed1aad06f34363979cdb055965d7177",
				appid: "wx31001c9ca057a395",
				grant_type: "client_credential"
			},
			header: {
				"Content-Type": "application/json"
			},
			success: (res_token) => {
				console.log(res_token)
				//获取  access_token 
				let access_token = res_token.data.access_token;
				uni.request({
					method: 'POST',
					url: "https://api.weixin.qq.com/wxa/msg_sec_check?access_token=" +
						access_token,
					data: {
						content: message.value
					},
					success: (rep) => {
						console.log(rep)
						if (rep.data.errcode == 87014) {
							uni.showToast({
								title: '内容含有敏感信息！',
								icon: 'none',
								duration: 2000
							})
							loading.value = false
							message.value = ''
						}
						if (rep.data.errcode == 0) {
							//成功之后处理
							messageList.push({
								info: message.value,
								from: 'my'
							})
							uni.request({
								url: 'http://45.32.169.59:8090/chat',
								method: 'GET',
								data: {
									prompt: message.value
								},
								success: (resm) => {
									let v = '请重新发送一下'
									if (resm.data.length > 0) {
										const s = resm.data.indexOf('data')
										const e = resm.data.lastIndexOf("'")
										v = resm.data.slice(s + 7, e)
									}
									messageList.push({
										info: v,
										from: 'chatgpt'
									})
									shareAddSubtract(false)
									loading.value = false
									message.value = ''
								},
								fail() {
									uni.showToast({
										title: '请稍后再试!',
										icon: 'error'
									})
									loading.value = false
								}
							})
						}
					},
					fail() {
						loading.value = false
					}
				});
			}
		});
		// loading.value = false


	}
</script>

<style lang="less">
	page {
		background-color: #4c85f2;
		height: 100%;
	}

	.title {
		margin-bottom: auto;
		text-align: center;
		font-size: 35px;
		color: #fff;
	}

	.share {
		height: 32px;
		line-height: 32px;
		display: flex;

		button {
			height: 32px;
			line-height: 32px;
			background-color: rgb(238, 242, 254);
			font-size: 14px;
		}
	}

	.left {
		display: flex;
		text-align: left;
		margin-left: 25rpx;

		.messageItem {
			background-color: rgb(238, 242, 254);
			color: black;
		}
	}

	.right {
		text-align: right;
		margin-right: 50rpx;
	}

	.content {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.messagebox {
		/* background-color: red; */
		overflow-y: auto;
		padding-top: 20px;
		border-top-left-radius: 25px;
		/* box-shadow: 0px 10px 10px 10px rgb(237, 242, 254); */
		border-top-right-radius: 25px;
		flex: 1;
		width: 100%;
		background-color: #fff;
		padding-bottom: 30px;
	}

	.messageItem {
		color: #fff;
		display: inline-block;
		box-sizing: border-box;
		max-width: 400rpx;
		background-color: rgb(76, 133, 242);
		border-radius: 10px;
		line-height: 32px;
		margin-bottom: 10px;
		padding-left: 25rpx;
		padding-right: 25rpx;
	}

	.messageInput {
		margin-top: -20px;
		display: flex;
		justify-content: center;
		/* margin-bottom: px; */
		border-top-left-radius: 25px;
		box-shadow: 10px 10px 10px 10px gray;
		border-top-right-radius: 25px;
		background-color: #fff;
		width: 100%;
		height: 80px;
		line-height: 80px;
		align-items: center;
		position: relative;
	}

	.inputItem {
		box-sizing: border-box;
		padding-left: 25rpx;
		padding-right: 150rpx;
		width: 700rpx;
		height: 48px;
		border-radius: 40px;
		background-color: rgb(237, 242, 254);
	}

	.messageButtonBox {
		// padding: 0px;
		text-align: center;
		position: absolute;
		right: 50rpx;
		height: 32px;
		line-height: 32px;
		min-width: 120rpx;
		background-color: rgb(76, 133, 242);
		border-radius: 40px;
		color: #fff;
	}

	.topbox {
		// background-image: url('@/static/hm.png');
		padding: 0rpx 25rpx 0rpx 25rpx;
		color: #fff;
		box-sizing: border-box;
		padding-top: 35px;
		width: 100%;
		background-color: #4c85f2;
		height: 20%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-bottom: 5px;
	}

	.pay {
		margin-top: 10px;
		display: flex;
		justify-content: space-between;

		button {
			font-size: 14px;
			height: 32px;
			line-height: 32px;
			background-color: rgb(237, 242, 254);
		}
	}

	.bgc {
		// align-self: flex-end;
		height: 25px;
		background-color: rgb(237, 242, 254);
	}

	.imgbox {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-right: 5px;
	}

	.sharebox {
		background-color: #edf2fe;
	}

	.sharebutton {
		flex: 1;
		display: flex;
		justify-content: space-between;
		button{
			margin: 0px;
		}
	}

	.share {
		display: flex;
		justify-content: space-between;
	}
	.sharecontent{
		height: 60px;
		    background-color: #eef2fe;
			border-radius: 20px;
			padding: 10px;
			color: #4c85f2;
	}
	.imghmpdxbox{
		width: 100%;
		display: flex;
		justify-content: center;
	}
	.hmbb, .pdx, .zyg, .xlb{
		height: 50px;
		width: 40px;
	}
	// .pdx{
	// 	height: 40px;
	// 	width: 40px;
	// }
</style>
