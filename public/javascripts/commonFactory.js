/**
 * @ngdoc service
 * @name PGapp:commonFactory
 *
 * @description
 *
 *
 * */
var post_set = {
    method: 'POST',
    isArray: false,
    headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': '*/*'},
    transformRequest: function (data, headersGetter) {
        var str = [];
        for (var d in data)
            str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
        return str.join("&");
    }
};
PGapp.factory('API', ['$resource', function ($resource, $scope) {
    var url = "/";
    var Service = {
        Login: $resource(url + 'api', {id: '@id'}, {
            login: post_set
        }),
        Users: $resource(url + 'api/userlist', {}, {
            Recent: post_set
        }),
        Create: $resource(url + 'api/createuser', {}, {
            User: post_set
        }),
        ChangePassword: $resource(url + 'api/changepassword', {}, {
            save: post_set
        }),
        CreateWorkOrder: $resource(url + 'api/create_workorder', {}, {
            save: post_set

        }),
        Categories: $resource(url + 'api/categories', {}, {
            Recent: post_set
        }),
        CreateCategory: $resource(url + 'api/create_category', {}, {
            Category: post_set
        }),
        Classes: $resource(url + 'api/classes', {}, {
            Recent: post_set
        }),
        CreateClass: $resource(url + 'api/create_class', {}, {
            Class: post_set
        }),
        Equipments: $resource(url + 'api/equipments', {}, {
            Recent: post_set
        }),
        CreateEquipment: $resource(url + 'api/create_equipment', {}, {
            Equipment: post_set
        }),
        Facilities: $resource(url + 'api/facilities', {}, {
            Recent: post_set
        }),
        CreateFacility: $resource(url + 'api/create_facility', {}, {
            Facility: post_set
        }),
        Priorities: $resource(url + 'api/priorities', {}, {
            Recent: post_set
        }),
        CreatePriority: $resource(url + 'api/create_priority', {}, {
            Priority: post_set
        }),
        Skills: $resource(url + 'api/skills', {}, {
            Recent: post_set
        }),
        CreateSkill: $resource(url + 'api/create_skill', {}, {
            Skill: post_set
        }),
        Status: $resource(url + 'api/status_list', {}, {
            Recent: post_set
        }),
        SFacilities: $resource(url + 'api/search_facilities', {}, {
            Recent: post_set
        }),
        SCategory: $resource(url + 'api/search_category', {}, {
            Recent: post_set
        }),
        SEquipment: $resource(url + 'api/search_equipment', {}, {
            Recent: post_set
        }),
        SPriority: $resource(url + 'api/search_priority', {}, {
            Recent: post_set
        }),
        SClass: $resource(url + 'api/search_class', {}, {
            Recent: post_set
        }),
        SSkill: $resource(url + 'api/search_skill', {}, {
            Recent: post_set
        }),
        SStatus: $resource(url + 'api/search_status', {}, {
            Recent: post_set
        }),
        ManageWorkorders: $resource(url + 'api/manager_workorder', {}, {
            Recent: post_set
        }),
        GetUserByType: $resource(url + 'api/get_users_type', {}, {
            Recent: post_set
        }),
        GetWorkOrder: $resource(url + 'api/get_workorder', {}, {
            Recent: post_set
        }),
        GetUser: $resource(url + 'api/get_user', {}, {
            Recent: post_set
        }),



    };

    return Service;
}]);
