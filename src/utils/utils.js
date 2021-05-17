//window.location.href = url; 也可下载文件
//get方式下载文件
export const autoDownloadGet = (address, fileName) => {
    // 创建a标签  图片和pdf会预览
    let a = document.createElement('a')
    // 定义下载名称
    a.download = fileName
    // 隐藏标签
    a.style.display = 'none'
    // 设置文件路径
    a.href = address
    // 将创建的标签插入dom
    document.body.appendChild(a)
    // 点击标签，执行下载
    a.click()
    // 将标签从dom移除
    document.body.removeChild(a)

}
//post方式下载文件
export const autoDownloadPost = (address, params) => {
    //params是post请求需要的参数，url是请求url地址
    var form = document.createElement("form");
    form.style.display = "none";
    form.action = address;
    form.method = "post";
    document.body.appendChild(form);
    // 动态创建input并给value赋值
    for (var key in params) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
    }
    form.submit();
    form.remove();
}

//获取年月日
export const getYYYYMMDD = (params, symbol) => {
    let obj = new Date(params)
    return obj.getFullYear() + symbol + padZero((obj.getMonth() + 1)) + symbol + padZero(obj.getDate())
}

//获取时分秒
export const getHHMMSS = (params, symbol) => {
    let obj = new Date(params)
    return padZero(obj.getHours()) + symbol + padZero((obj.getMinutes())) + symbol + padZero(obj.getSeconds())
}

//获取完整时间 格式    "2020-06-04 00:00:00",
export const getfulltime = (params) => {
    let obj = new Date(params)
    return obj.getFullYear() + '-' + padZero((obj.getMonth() + 1)) + '-' + padZero(obj.getDate()) + ' ' + padZero(obj.getHours()) + ':' + padZero((obj.getMinutes())) + ':' + padZero(obj.getSeconds())
}

//补零
export const padZero = (params) => {
    return params < 10 ? '0' + params : params
}


//从外部引入js文件
export const remoteLoad = (url, hasCallback) => {
    return createScript(url)
    /**
     * 创建script
     * @param url
     * @returns {Promise}
     */
    function createScript(url) {
        var scriptElement = document.createElement('script')
        document.body.appendChild(scriptElement)
        var promise = new Promise((resolve, reject) => {
            scriptElement.addEventListener('load', e => {
                removeScript(scriptElement)
                if (!hasCallback) {
                    resolve(e)
                }
            }, false)

            scriptElement.addEventListener('error', e => {
                removeScript(scriptElement)
                reject(e)
            }, false)

            if (hasCallback) {
                window.____callback____ = function () {
                    resolve()
                    window.____callback____ = null
                }
            }
        })

        if (hasCallback) {
            url += '&callback=____callback____'
        }

        scriptElement.src = url

        return promise
    }

    /**
     * 移除script标签
     * @param scriptElement script dom
     */
    function removeScript(scriptElement) {
        document.body.removeChild(scriptElement)
    }
}

//导出excel文件
export function batchExport(data, name, extension = 'json', type = 'application/json') {
    const aLink = document.createElement('a');
    const blob = new Blob([data], { type: type });
    aLink.download = name + '.' + extension;
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
    URL.revokeObjectURL(aLink.href);
}

//简单深克隆
export function deepClone(obj) {
    if (obj === null) return null
    if (typeof obj !== 'object') return obj
    if (obj instanceof RegExp) return new RegExp(obj)
    if (obj instanceof Date) return new Date(obj)
    if (obj instanceof Function) return new Function(obj)
    let newObj = new obj.constructor
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = deepClone(obj[key])
        }
    }
    return newObj
}
//使用rem配置PC端自适应大屏
export function setRem() {
    //  PC端
    // console.log('非移动设备')
    // 基准大小
    let baseSize = 100;
    let basePc = baseSize / 1920; // 表示1920的设计图,使用100PX的默认值
    let vW = window.innerWidth; // 当前窗口的宽度

    let rem = vW * basePc; // 以默认比例值乘以当前窗口宽度,得到该宽度下的相应font-size值
    document.documentElement.style.fontSize = rem + "px";
}