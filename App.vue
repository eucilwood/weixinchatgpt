<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		onShareAppMessage:function(){
			return {
				title: "23232323",
				success: function(res) {
					console.log(res)
					// 转发成功
				},
				fail: function(res) {
					// 转发失败
					console.log(err)
				}
			};
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
