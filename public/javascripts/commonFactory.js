/**
 * @ngdoc service
 * @name MyApp:commonFactory
 *
 * @description
 *
 *
 * */
PGapp
    .factory('API', ['$resource',function($resource,$scope){
    var url = "/"
    var Service = {
        Login:$resource(url+'api', {id: '@id'}, {
            login: {
                method:'POST',
                isArray:false,
                headers:{'Content-Type': 'application/x-www-form-urlencoded','Accept' : '*/*'},
                transformRequest: function (data, headersGetter) {
                    var str = [];
                    for (var d in data)
                        str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
                    return str.join("&");
                }
            }
        }),
        Users:$resource(url+'api/userlist', {}, {
            Recent: {
                method:'POST',
                isArray:false,
                headers:{'Content-Type': 'application/x-www-form-urlencoded','Accept' : '*/*'},
                transformRequest: function (data, headersGetter) {
                    var str = [];
                    //  str.push(encodeURIComponent(data));
                    for (var d in data)
                        str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
                    return str.join("&");
                }
            }
        }),
        Create:$resource(url+'api/createuser', {}, {
            User: {
                method:'POST',
                isArray:false,
                headers:{'Content-Type': 'application/x-www-form-urlencoded','Accept' : '*/*'},
                transformRequest: function (data, headersGetter) {
                    var str = [];
                    //  str.push(encodeURIComponent(data));
                    for (var d in data)
                        str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
                    return str.join("&");
                }
            }
        }),
        ChangePassword:$resource(url+'api/changepassword', {}, {
                save: {
                    method: 'POST',
                    isArray: false,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': '*/*'},
                    transformRequest: function (data, headersGetter) {
                        var str = [];
                        //  str.push(encodeURIComponent(data));
                        for (var d in data)
                            str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
                        return str.join("&");
                    }
                }

        }),

    };

    return Service;
}]);
