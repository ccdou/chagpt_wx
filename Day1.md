
   说来惭愧，上了这么多年学，天天是照本宣科的学那些陈旧的东西，到社会上开始一问三不知哈哈，最近痛定思痛，决定重整旗鼓再出发，现在我以一个小白的角度开始，一点点记录我的学习过程，也算作我的学习笔记吧
  
**学习阶段的第一个任务：做一个封装chatgpt功能的微信小程序**


**Day1（9.08）我的水平：没有一点点前端基础 ，没搞过云服务器 ，学过C++，PYTHON，用过ubuntu，写过一些命令行**

   开始之前，我必须得说上两句，有句俗话叫，一头猪放在风口上都能飞起来 ，现在风口是什么，是以chatgpt为代表的一系列语言大模型？毕竟现在chatgpt的api已经全部放开 ，包括3.5和4，是一直很火的云服务器？还是已经推出挺长时间的微信小程序？

这些在日常中我都不断的在听说，但是从没有下定决心，自己去尝试一下，日子一天天过去，真的别等到来不及的时间再后悔，我的目标是争取做个永远追逐知识的幽邃猎犬。。。。。
   

***云服务器***


一直听其他人说云服务器，觉得很高大上的样子（笑），其实我觉得做成一件事最难的两个阶段，一个是你对它一无所知的时候，一个是你觉得自己对它已经很了解的时候，现在我就是处于第一个节点，闲话少聊，我们进入正题。
云服务器我选择了阿里云服务器，因为可以白嫖几个月的学生优惠

我原本以为云服务器是个啥高大上的东西，其实进去以后都是比较熟悉的老一套，不就是个类似于外置电脑的（可能描述不准确）的东东。

买完以后，会进入相关界面，这时候选择一个我们比较熟悉的系统，建议别选第一个阿里linux系统，我一开始选了那个系统，安好的python版本居然是3.6的，导致各种库更不到最新的状态，进而导致代码各种报错，还是选择比较习惯的Ubuntu吧。

好了，现在对云服务器是个啥已经了解了，我的目的是做一个微信小程序，也就是说我们现在完成了一半的硬件要求了


***微信开发者工具***


安装微信开发者工具，注册APPID，过程不再赘述，官方有详细文档


***CHATGPT API：***


这个我只能说懂得都懂，API_key都是需要额外获取的，差不多调用chatgtp的api流程就如下

（ps：网页版使用chatgpt免费的，但调用api是付费的）


```python
import openai
openai.api_base = '  '
openai.api_key = ''

if __name__ == '__main__':

  response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
      {"role": "system", "content": "You are a chatbot"},
      {"role": "user", "content": "Why should DevOps engineer learn kubernetes?"},
    ]
  )
  print(response)
```


好，现在准备工作全做完了，开始正式的写代码过程了，是不是不是很难，有了上面所说的东西，现在几乎可以开发各种类型的微信小程序、小游戏了。



## 代码


首先捋一下整体数据是怎么流动的，这也是我感觉一个比较通用的模板了

用户输入->前端接受->发给后端->后端调用相应的处理->后端返回相应的值给前端->前端用这个值显示（或做各种处理）

我们先做后端相关的一部分，为什么呢，因为买了服务器以后，我迫不及待的想先整一下服务器玩玩哈哈，  所以我们先来看下这个流程：发给后端->后端调用相应的处理->后端返回相应的值给前端。


对这个项目来说，我们要做的就是 发给后端->后端调用api->获得api的返回值送回前端。

后端服务怎么整？CHATGPT这么回答的

> 在微信小程序中，要创建一个后端服务，你通常需要使用一个后端框架（如Node.js、Python Flask、Java Spring等）来处理HTTP请求，并与ChatGPT API进行交互



OK，那我们就按照它的思路开整，对Python比较熟，那我肯定优先选flask框架。


0、配置一个虚拟环境

```bash
sudo pip install virtualenv

virtualenv venv

source venv/bin/activate

```


1、安装 Flask：

首先，确保你的服务器上已经安装了 Python。然后可以使用 pip（Python 包管理器）来安装 Flask。运行以下命令：

```bash
 pip install Flask 
```


 2、创建 Flask 应用：

创建一个新的目录，并在该目录中创建一个 Python 文件，例如 app.py。在 app.py 文件中编写 Flask 应用的代码。



3、编写 Flask 应用：

编写 Flask 应用的代码，包括路由、视图函数、模板等。你可以根据你的需求来设计路由和视图函数，以处理前端发送的请求。

1,2应该都不难吧哈哈，那开始第三步编写 Flask 应用。

开始前先确认下我们的云服务器的ip是啥，在阿里云服务器网站中打开控制面板、我们的实例，可以看到公网ip:XXXXX，这就是我们后续要用到的ip地址


后端代码用到了openai，flask相关的库，注意一定要保证openai是比较新的版本0.27以上，不然会出现问题

会接受用户的输入，并将该信息输出到api中，接受api的返回，输出回前端


```python


import openai

from flask import Flask, request, jsonify



app = Flask(__name__)


# 设置 ChatGPT API 相关信息

openai.api_base = ''

openai.api_key = ''  # 请替换为你的有效 API 密钥




@app.route('/ask', methods=['POST'])

def ask_question():

    try:

        user_input = request.json['user_input']

        print('input: {}'.format(user_input))

        response = openai.ChatCompletion.create(

            model="gpt-3.5-turbo",

            messages=[

                {"role": "system", "content": "You are a chatbot"},

                {"role": "user", "content": user_input}

            ]

        )

        print('response : {}'.format(response))

        chat_response = response['choices'][0]['message']['content']

        return jsonify({"response": chat_response})



    except Exception as e:

        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':

    app.run(host='0.0.0.0', port=3000)



"chat.py" 32L, 1038B                                                                                                                                                    32,0-1        All
```


***第一天任务圆满结束，用时一个白天（搜索相关的信息，确定实际需要什么）+ 一个晚上（准备工作+后端代码），大家都完成了吗（笑）***








