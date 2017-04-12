// 获取应用程序
var app = angular.module('myApp',['ui.router']);
// 定义路由
app.config(function($stateProvider,$urlRouterProvider){
      // 通过state方法定义状态
      // 定义home状态
      $stateProvider.state('home',{
           url : '/home',
           templateUrl : 'view/home.html',
           // 定义控制器
           controller : 'homeCtrl'
      }).state('login',{
           // 定义登录页面的状态
           url : '/login',
           templateUrl : 'view/login.html',
           // 定义控制器
           controller : 'loginCtrl'
      }).state('userlist',{
               // 用户模块路由 由列表页 详情页 创建页
               // 用户列表页
               // 要知道进入列表页的第几页
               url : '/userlist/:pagenum',
               templateUrl : 'view/user/list.html',
               controller : 'userlistCtrl'
      }).state('userdetail',{
               // 用户详情页
               // 进入详情页要知道查看的是哪个用户
               url : '/userdetail/:userid',
               templaeUrl : 'view/user/detail.html',
               controller : 'userdetailCtrl'
      }).state('usercreate',{
               // 用户创建页
               url : '/usercreate',
               templateUrl : 'view/user/create.html',
               controller : 'usercreateCtrl'
      }).state('newlist',{
               // 新闻模块由 列表页 详情页 创建页
               // 新闻列表页
               url : '/newlist/:pagenum',
               templateUrl : 'view/news/list.html',
               controller : 'newlistCtrl'
      }).state('newdetail',{
               // 新闻详情页
               url : '/newdetail/:newid',
               templateUrl : 'view/news/detail.html',
               controller : 'newdetailCtrl'
      }).state('newcreate',{
               // 新闻创建页
               url : '/newcreate',
               templateUrl : 'view/news/create.html',
               controller : 'newcreateCtrl'
      })
      // 定义默认页面
      $urlRouterProvider.otherwise('/home')
}).controller('headerCtrl',function($scope,$http,$location,$rootScope){
      // 创建头部控制器
      // 向后台发送请求 是否登录的接口
      $http.get('action/checkLogin.php').success(function(res){
           if(res && res.errno === 0 && !res.data){
               // 跳转到登录页
               $location.path('/login');
           }else if(res && res.errno === 0 && res.data){
                     // 更改根作用域
               $rootScope.userName = res.data.username;
           };
           // 并显示页面
           $rootScope.isShowAll = 'block';
      });
}).controller('navCtrl',function($scope){
      // 定义导航控制器
      // 定义导航数据
      $scope.list = [
         // 用户模块
         {
            title : '用户模块',
            childList : [
                  {     // 子模块的title
                        subTitle : '用户列表',
                        // 子模块的链接
                        link : '#/userlist/1'
                  },
                  {
                        subTitle : '创建用户',
                        link : '#/usercreate'
                  }
            ]
         },
         {
            title : '新闻模块',
            childList : [
                  {
                        subTitle : '新闻列表',
                        link : '#/newlist/1'
                  },
                  {
                        subTitle : '创建新闻',
                        link : '#/newcreate'
                  }
            ]
         }
      ]
}).service('checkLogin',function($rootScope,$location){
   // 封装 用面相对象 检验是否登录接口
   this.check = function(){
       // 如果不存在$rootScope.userName 进入登录页面
       if(!$rootScope.userName){
           $location.path('/login');
       }
   }
}).controller('homeCtrl',function($scope,$interval){
   // 定义home状态的控制器 引入循环时间服务 $interval
   $scope.date = new Date();
   // 用$interval服务循环时间
   $interval(function(){
     $scope.date = new Date();
   })
}).controller('loginCtrl',function($scope,$http,$location,$rootScope){
   // 定义登陆页面的控制器
       $scope.goToLogin = function(){
            // 点击的时候，向login页面提交数据
            // 并监听返回的数据 如果成功向根作用域添加uesrname数据，
            // 并跳转到首页
            $http.post('action/login.php',$scope.user).success(function(res){
                  if(res && res.errno === 0 && res.data){
                        $rootScope.userName = res.data.username;
                        // 跳转首页
                        $location.path('/home')
                  }
            });

       }
}).controller('userlistCtrl',function($scope,$http,$stateParams,checkLogin){
      // 定义用户列表页的控制器
      // 检验用户是否登录
      checkLogin.check();
      // 获取用户进入那个页面 保存num
      $scope.num = $stateParams.pagenum;
      // 请求数据
      $http.get('action/userlist.php?pageNum=' + $scope.num).success(function(res){
          // console.log(res);
          // 如果返回成功，将数据保存在list变量中
          if(res && res.errno === 0){
              $scope.list = res.data;
          };
      });
}).controller('userdetailCtrl',function($scope,checkLogin,$http,$stateParams){
      // 定义用户详情页的控制器
      // 验证是否登录
      checkLogin.check();
      // 请求数据
      $http.get('action/userdetail.json?userId=' + $stateParams.userid).success(function(res){
           if(res && res.errno === 0){
              $scope.user = res.data;
           }
      })
}).controller('usercreateCtrl',function($scope,checkLogin,$http,$location){
      // 定义用户创建页的控制器
      // 检查是否登录
      checkLogin.check();
      // 当用户按提交按钮的时候 提交页面 发送数据
      $scope.submitUser = function(){
          $http.post('action/createuser.php',$scope.user).success(function(res){
              console.log(res);
              // 如果提交成功就进入列表页 如果失败，重新提交
              if(res && res.errno === 0){
                 $location.path('/userlist/1')
              } else{
                 alert("提交失败，请重新提交！");
              }
           })
      }
}).controller('newlistCtrl',function($scope,checkLogin,$stateParams,$http){
      // 定义新闻列表页的控制器
      // 检查是否登录
      checkLogin.check();
      // 获取页面编码 根据页码请求数据
      $scope.num = $stateParams.pagenum;
      // 请求数据
      $http.get('action/newslist.php?pagenum=' + $scope.num).success(function(res){
          if(res && res.errno === 0){
             // 存储数据
             $scope.list = res.data;
          };
      });
}).controller('newdetailCtrl',function($scope,checkLogin,$http,$stateParams){
      // 定义新闻详情页的控制器
      // 检查是否登录
      checkLogin.check();
      // 得到新闻的id
      var id = $stateParams.newid;
      $http.get('action/newsdetail.php?id=' + id).success(function(res){
          if(res && res.errno === 0){
             // 保存数据
             $scope.news = res.data;
          }
      });
}).controller('newcreateCtrl',function($scope,checkLogin,$http,$location){
      // 定义新闻创建页的控制器
      // 检查是否登录
      checkLogin.check();
      // 触发提交事件
      $scope.submitNews = function(){
         // 适配时间
         $scope.newsData.date = new Date().getTime();
         $http.post('action/createnews.php',$scope.newsData.date).success(function(res){
              // 提交数据 如果成功 跳转到新闻列表页 失败给提示
              if(res && res.errno === 0){
                 $location.path('/newlist/1');
              }else{
                alert("提交失败，请重新提交！");
              };
         });
      };
})