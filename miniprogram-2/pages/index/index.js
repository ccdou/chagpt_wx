//index.js
Page({
  data: {
    userInput: "", // 用户输入的内容
    messages: [], // 存储消息的数组
  },

  // 处理输入框输入事件
  onInput: function (e) {
    this.setData({
      userInput: e.detail.value,
    });
  },

  // 发送用户输入到后端服务器
  sendRequest: function () {
    const userInput = this.data.userInput.trim();// 去除输入内容两端的空白字符
    if (!userInput) {
      return; // 输入内容为空，不执行发送操作
    }
    const messages = this.data.messages;
    messages.push({ role: 'user', content: userInput });
    this.setData({
      messages,
      userInput: '',
    });
    setTimeout(() => {
      this.setData({
        userInput: '', // 这里再次设置为空，确保输入框刷新
      });
    }, 0);

    wx.request({
      url: '', // 后端服务器地址
      method: 'POST',
      data: {
        user_input: userInput, // 用户输入的内容
      },
      success: (res) => {
        // 检查 statusCode 是否为 200
        if (res.statusCode == 200) {
          // 处理服务器返回的响应
          console.log("success");
          messages.push({ role: 'server', content: res.data.response });
          this.setData({
            messages,
          });
        } else {
          // 当 statusCode 不为 200 时，可以执行错误处理
          console.log("fail");
          messages.push({ role: 'server', content: "sorry,失联了...." });
          this.setData({
            messages,
          });
        }
        
      },
      fail: (res) => {
        // 处理请求失败情况
        console.log('请求失败');
        console.error('请求失败', res);
        messages.push({ role: 'server', content: "sorry,失联了...." });
        this.setData({
            messages,
        });
      },
    });
  },
})
