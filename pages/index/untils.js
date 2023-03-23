// 插屏广告
var interstitialAd = null;
export default interstitial = {
	//id就是传入的广告位id
	load(id) {
		if (uni.createInterstitialAd) {
			interstitialAd = uni.createInterstitialAd({
				adUnitId: id
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
		}
	},
	show() {
		if (interstitialAd) {
			interstitialAd.show().catch((err) => {
				console.error(err)
			})
		}
	}
}
