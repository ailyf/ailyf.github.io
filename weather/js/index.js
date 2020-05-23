$(function () {

    class Weather {
        constructor() {

            //天气请求基础路径
            this.baseUrl = 'https://api.heweather.net/s6/weather/';

            //密钥
            this.key = '72d5e1e687c24feaa0c6a1783e48c17a';
        }
        //定位
        locationCity() {
            //self:Weather
            let self = this;

            //使用腾讯地图API获取城市定位
            $.ajax({
                type: 'get',
                data: {
                    key: 'RBRBZ-K6J3D-M7D4W-HJR2M-E4HRH-IVBD3',
                    output: 'jsonp'
                },
                url: 'https://apis.map.qq.com/ws/location/v1/ip',
                dataType: 'jsonp',
                jsonp: 'callback',
                success(data) {

                    let city = data.result.ad_info.city;

                    $('.area').text(city);

                    //获取定位城市的实况天气
                    self.getCurrentWeather(city);

                    //逐日气预报
                    self.dailyForecastWeather(city);

                    self.hourlyForecastWeather(city);
                }
            })
        }

        //获取年月日时
        getTime() {

            let date = new Date();

            //获取年份
            let year = date.getFullYear();

            //获取月份
            let month = date.getMonth() + 1;
            month = month >= 10 ? month : '0' + month;

            //获取日
            let d = date.getDate();
            d = d >= 10 ? d : '0' + d;

            //获取时
            let hours = date.getHours() + 1;
            hours = hours < 10 ? '0' + hours : hours == 24 ? '00' : hours;

            return year + '-' + month + '-' + d + ' ' + hours + ':00';


        }

        //获取实况天气
        getCurrentWeather(city) {
            let self = this;
            $.ajax({
                type: 'get',
                url: self.baseUrl + 'now',
                data: {
                    location: city,
                    key: self.key
                },
                success(data) {
                    // console.log(data);

                    let now = data.HeWeather6[0].now;

                    //体感温度
                    $('.tem').text(now.fl + '°');

                    //天气情况
                    $('.status-l').text(now.cond_txt);

                    //风向/风力
                    $('.status-r').text(now.wind_dir + now.wind_sc + '级');
                }
            })
        }

        //创建逐时天气数据
        createHourlyForecast(hourlyForecast) {
            //设置宽度

            let $weatherDataBox = $('.all-hours');

            $weatherDataBox.empty('');

            $weatherDataBox.css({
                width: hourlyForecast.length * .5 + 'rem'
            })

            //遍历生成
            $.each(hourlyForecast, (i, v) => {

                let html = `<div class="hours-tem">
                        <div class="time">${v.time.split(' ')[1]}</div>
                        <div class="icon"><img class="auto-img" src="./img/${v.cond_code}.png"></div>
                        <div class="du">${v.tmp}°</div>
                    </div>`;

                $weatherDataBox.append(html);
            })
        }


        //逐时天气预报
        hourlyForecastWeather(city) {
            let self = this;

            //判断是否缓存数据
            let forecastWeather = JSON.parse(localStorage.getItem('forecastWeather'));

            //存在
            if (forecastWeather.hourly.length > 0) {

                //获取当前日期
                let currentDate = self.getTime();
                console.log(currentDate);


                let oldDate = forecastWeather.hourly[0].time;

                if (currentDate == oldDate) {
                    console.log('存在逐小时天气数据');
                    self.createHourlyForecast(forecastWeather.hourly);
                    return;
                }

            }

            $.ajax({
                type: 'get',
                url: this.baseUrl + 'hourly',
                data: {
                    location: city,
                    key: this.key
                },
                success(data) {

                    console.log(data);

                    let hourlyForecast = data.HeWeather6[0].hourly;

                    self.createHourlyForecast(hourlyForecast);

                    forecastWeather.hourly = hourlyForecast;

                    localStorage.setItem('forecastWeather', JSON.stringify(forecastWeather));

                }
            })
        }

        //生成逐日天气数据
        createDaliyForecast(dailyForecast) {

            let $weatherDataBox = $('.day-box');
            $weatherDataBox.empty('');

            //遍历生成
            $.each(dailyForecast, (i, v) => {

                let html = `<div class="day">
                        <div class="dayList">${v.date.split('-').slice(1).join('-')}</div>
                        <div class="img">
                            <div class="img1">
                                <img class="auto-img" src="./img/${v.cond_code_d}.png">
                            </div>
                            <div class="situation">${v.cond_txt_d}</div>
                        </div>
                        <div class="range">${v.tmp_min + '°~' + v.tmp_max }°</div>
                    </div>`;

                $weatherDataBox.append(html);
            })
        }

        //逐日天气预报
        dailyForecastWeather(city) {

            let self = this;

            //判断是否缓存数据
            let forecastWeather = JSON.parse(localStorage.getItem('forecastWeather'));


            //存在
            if (forecastWeather.daily.length > 0) {


                //获取当前日期
                let currentDate = new Date().toLocaleDateString().split('/');
                currentDate[1] = currentDate[1] >= 10 ? currentDate[1] : '0' + currentDate[1];
                currentDate[2] = currentDate[2] >= 10 ? currentDate[2] : '0' + currentDate[2];

                let currentTime = currentDate.join('-');

                let oldTime = forecastWeather.daily[0].date;

                if (currentTime == oldTime) {
                    self.createDaliyForecast(forecastWeather.daily);
                    return;
                }

            } else {
                $.ajax({
                    type: 'get',
                    url: this.baseUrl + 'forecast',
                    data: {
                        location: city,
                        key: this.key
                    },
                    success(data) {


                        let dailyForecast = data.HeWeather6[0].daily_forecast;

                        self.createDaliyForecast(dailyForecast);

                        forecastWeather.daily = dailyForecast;

                        localStorage.setItem('forecastWeather', JSON.stringify(forecastWeather));

                    }
                })
            }

        }

        //设置背景颜色
        weatherBg() {
            //获取当前时间
            let hours = new Date().getHours();

            let $weather = $('.weather');

            if (hours >= 6 && hours < 12) {
                $weather.css({
                    backgroundImage: 'url("./img/m.jpg")'
                })
            } else if (hours >= 12 && hours < 19) {
                $weather.css({
                    backgroundImage: 'url("./img/a.jpg")'
                })
            } else {
                $weather.css({
                    backgroundImage: 'url("./img/n.jpg")'
                })
            }
        }

        init() {

            this.weatherBg();

            //初始化缓存逐日，逐时数据
            if (!localStorage.getItem('forecastWeather')) {
                //逐日: daily
                //逐时: hourly

                let forecastWeather = {
                    daily: [],
                    hourly: []
                }

                localStorage.setItem('forecastWeather', JSON.stringify(forecastWeather));

            }

            this.locationCity();
        }

    }

    var weather = new Weather;
    weather.init();

    // 搜索按钮
    $('.a1').on('click', function () {
        $('.pre').show();
        $('.area').hide();
        $('.a1').hide();
    })
    $('.a2').on('click', function () {
        $('.pre').hide();
        $('.area').show();
        $('.a1').show();

    })

    //切换城市
    $('.big').on('click', function () {
        let city = $('.ipt').val();

        if (city.trim() == '') {
            return;
        }

        //清空逐日逐小时天气数据
        let forecastWeather = {
            daily: [],
            hourly: []
        }

        localStorage.setItem('forecastWeather', JSON.stringify(forecastWeather));

        $('.area').text(city);

        $('.ipt').val('');

        $('.a2').click();

        //获取实况天气
        weather.getCurrentWeather(city);

        // 获取逐日天气数据
        weather.dailyForecastWeather(city);
    })

})