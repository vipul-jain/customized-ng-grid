/**
 * Created with JetBrains WebStorm.
 * User: wa
 * Date: 7/30/13
 * Time: 4:30 PM
 * To change this template use File | Settings | File Templates.
 */

function gridcontroller($scope, $http){

    $scope.logic = "selected";
    $scope.AllData = [];
    $scope.AllSelected = false;
    $scope.IsSortingNow = true;
    $scope.mySelections = [];
    $scope.myfilter = {
      field : "",
      value : ""
    };

    $scope.filterOptions = {
        filterText: '', //"id":0
        filterTextId:'',
        filterTextName:'',
        filterTextCity:'',
        filterTextEmail:'',
        useExternalFilter: false
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [5,10,15, 50, 100,250, 500, 1000, 2000],
        pageSize: 10,
        currentPage: 1
    };
    $scope.setPagingData = function(data, page, pageSize){

        $scope.AllData = data;
        if($scope.manualsorting.field != ""){
            if($scope.manualsorting.isASC)
                data.sort(function(a, b) { return a[$scope.manualsorting.field] > b[$scope.manualsorting.field]});
            else
                data.sort(function(a, b) { return a[$scope.manualsorting.field] < b[$scope.manualsorting.field]});
        }

        if($scope.myfilter.field != ""){
            data = data.filter(function (el) {
                return (el[$scope.myfilter.field].toString().indexOf($scope.myfilter.value) >= 0);
            });
        }


        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);

        for(var intIndex1= 0; intIndex1 < pagedData.length; intIndex1++){

            for(var intIndex2= 0; intIndex2 < $scope.mySelections.length; intIndex2++){
                if(pagedData[intIndex1].id == $scope.mySelections[intIndex2].id){
                    pagedData[intIndex1].checked = true;
                    break;
                }
                else
                    pagedData[intIndex1].checked = false;
            }



       /*
       if($scope.mySelections.indexOf(pagedData[intIndex]) != -1){
           pagedData[intIndex].checked = true;
       }
        else{
           pagedData[intIndex].checked = false;
       }*/
        }
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('json/data.json').success(function (largeLoad) {
                    data = largeLoad.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });
            } else {
                    $http.get('json/data.json').success(function (largeLoad) {
                        $scope.setPagingData(largeLoad,page,pageSize);
                    });
            }
        }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    /*
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    */
    $scope.$watch('pagingOptions.pageSize', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    },true);

    /********************************************** Manual sorting Logic ***************************************************/

        $scope.ID = {down:false,up:true};
        $scope.Name = {down:false,up:true};
        $scope.City = {down:false,up:true};
        $scope.Email = {down:false,up:true};
        $scope.manualsorting = {field : "",isASC : ""};

    var myHeaderCellTemplateId = '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{cursor: col.cursor}" ng-class="{ ngSorted: !noSortVisible }">'+
        '<div ng-click="sortByID()" ng-class="\'colt\' + col.index" class="ngHeaderText">{{col.displayName}}</div>'+
        '<div class="ngSortButtonDown" ng-show="ID.down"></div>'+
        '<div class="ngSortButtonUp" ng-show="ID.up"></div>'+
        '<div class="ngSortPriority">{{col.sortPriority}}</div>'+
        '<input type="text" ng-model="gridOptions.filterOptions.filterTextId"/>'+
        '</div>'+
        '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';

    var myHeaderCellTemplateName = '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{cursor: col.cursor}" ng-class="{ ngSorted: !noSortVisible }">'+
        '<div ng-click="sortByName()" ng-class="\'colt\' + col.index" class="ngHeaderText">{{col.displayName}}</div>'+
        '<div class="ngSortButtonDown" ng-show="Name.down"></div>'+
        '<div class="ngSortButtonUp" ng-show="Name.up"></div>'+
        '<div class="ngSortPriority">{{col.sortPriority}}</div>'+
        '<input type="text" ng-model="gridOptions.filterOptions.filterTextName"/>'+
        '</div>'+
        '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';

    var myHeaderCellTemplateCity = '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{cursor: col.cursor}" ng-class="{ ngSorted: !noSortVisible }">'+
        '<div ng-click="sortByCity()" ng-class="\'colt\' + col.index" class="ngHeaderText">{{col.displayName}}</div>'+
        '<div class="ngSortButtonDown" ng-show="City.down"></div>'+
        '<div class="ngSortButtonUp" ng-show="City.up"></div>'+
        '<div class="ngSortPriority">{{col.sortPriority}}</div>'+
        '<input type="text" ng-model="gridOptions.filterOptions.filterTextCity"/>'+
        '</div>'+
        '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';

    var myHeaderCellTemplateEmail = '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{cursor: col.cursor}" ng-class="{ ngSorted: !noSortVisible }">'+
        '<div ng-click="sortByEmail()" ng-class="\'colt\' + col.index" class="ngHeaderText">{{col.displayName}}</div>'+
        '<div class="ngSortButtonDown" ng-show="Email.down"></div>'+
        '<div class="ngSortButtonUp" ng-show="Email.up"></div>'+
        '<div class="ngSortPriority">{{col.sortPriority}}</div>'+
        '<input type="text" ng-model="gridOptions.filterOptions.filterTextEmail"/>'+
        '</div>'+
        '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';

    $scope.sortByID = function(){

        $scope.manualsorting.field = "id";
        if($scope.ID.down){
            $scope.manualsorting.isASC = true;
            $scope.ID.down = false;
            $scope.ID.up = true;
        }
        else{
            $scope.manualsorting.isASC = false;
            $scope.ID.down = true;
            $scope.ID.up = false;
        }
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    };

    $scope.sortByName = function(){
        $scope.manualsorting.field = "name";
        if($scope.Name.down){
            $scope.manualsorting.isASC = true;
            $scope.Name.down = false;
            $scope.Name.up = true;
        }
        else{
            $scope.manualsorting.isASC = false;
            $scope.Name.down = true;
            $scope.Name.up = false;
        }
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    };

    $scope.sortByCity = function(){
        $scope.manualsorting.field = "id";
        if($scope.City.down){
            $scope.manualsorting.isASC = true;
            $scope.City.down = false;
            $scope.City.up = true;
        }
        else{
            $scope.manualsorting.isASC = false;
            $scope.City.down = true;
            $scope.City.up = false;
        }
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    };

    $scope.sortByEmail = function(){
        $scope.manualsorting.field = "id";
        if($scope.Email.down){
            $scope.manualsorting.isASC = true;
            $scope.Email.down = false;
            $scope.Email.up = true;
        }
        else{
            $scope.manualsorting.isASC = false;
            $scope.Email.down = true;
            $scope.Email.up = false;
        }
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    };

    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
        showFooter: true,
        rowHeight: 36,
        headerRowHeight: 60,
        totalServerItems: 'totalServerItems',
        showColumnMenu: true,
        selectWithCheckboxOnly: true,

        beforeSelectionChange: function(obj){
            /*
            console.log(obj);
            console.log(obj.entity);
            console.log($scope.mySelections);
            console.log(obj.entity.checked);
            */
            if(obj.entity == undefined){
                if($scope.AllSelected){
                    $scope.mySelections = [];
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                    $scope.AllSelected = false;
                }
                else{
                    $scope.mySelections = $scope.AllData;
                    for(var intIndex=0; intIndex < $scope.mySelections.length; intIndex++ ){
                        $scope.mySelections[intIndex].checked = true;
                    }
                    $scope.AllSelected = true;
                }
            }
            else
            {
                if(obj.entity.checked == true){
                for(var intIndex=0; intIndex<$scope.mySelections.length; intIndex++){
                    if(JSON.stringify($scope.mySelections[intIndex]) == JSON.stringify(obj.entity)){
                        $scope.mySelections.splice(intIndex,1);
                        break;
                    }
                }

                $scope.myData[$scope.myData.indexOf(obj.entity)].checked = false;
                }
                else{
                    obj.entity.checked = true;
                    $scope.mySelections.push(obj.entity);
                }
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        },
        //selectedItems: $scope.mySelections,
       // rowTemplate: "<div ng-style=\"{'cursor': row.cursor, 'z-index': col.zIndex() }\" ng-repeat=\"col in renderedColumns\" ng-class=\"col.colIndex()\" class=\"ngCell  {{col.cellClass}} \" ng-cell></div>",
        showSelectionCheckbox: true,
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs: [{field: 'id', displayName: 'ID', enableCellEdit: false, headerCellTemplate: myHeaderCellTemplateId, colFilterText: ''},
                     {field:'name', displayName:'Name', enableCellEdit: true, headerCellTemplate: myHeaderCellTemplateName, colFilterText: '' },
                     {field:'city', displayName: 'City', enableCellEdit: true, headerCellTemplate: myHeaderCellTemplateCity, colFilterText: ''},
                     {field:'email', displayName:'Email Id', enableCellEdit: true, headerCellTemplate: myHeaderCellTemplateEmail, colFilterText: ''}]
    };

    $scope.gridOptionsSelected = {
        data: 'mySelections',
        columnDefs: [{field: 'id', displayName: 'ID'},
            {field:'name', displayName:'Name'},
            {field:'city', displayName: 'City'},
            {field:'email', displayName:'Email Id'}]

    };



    $scope.$watch('gridOptions.filterOptions.filterTextId', function(searchText, oldsearchText) {
        if (searchText !== oldsearchText) {
            if(searchText == ""){
                $scope.myfilter.field = "id";
                $scope.myfilter.value = "";
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                //$scope.gridOptions.filterOptions.filterText = $scope.gridOptions.filterOptions.filterText.replace(oldsearchText, "");
            }
            else{
                $scope.myfilter.field = "id";
                $scope.myfilter.value = searchText.trim();
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }

        }
    });

    $scope.$watch('gridOptions.filterOptions.filterTextName', function(searchText, oldsearchText) {
        if (searchText !== oldsearchText) {
            if(searchText == ""){
                $scope.myfilter.field = "name";
                $scope.myfilter.value = "";
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                //$scope.gridOptions.filterOptions.filterText = $scope.gridOptions.filterOptions.filterText.replace(oldsearchText, "");
            }
            else{
                $scope.myfilter.field = "name";
                $scope.myfilter.value = searchText.trim();
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }

        }
    });

    $scope.$watch('gridOptions.filterOptions.filterTextCity', function(searchText, oldsearchText) {
        if (searchText !== oldsearchText) {
            if(searchText == ""){
                $scope.myfilter.field = "city";
                $scope.myfilter.value = "";
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                //$scope.gridOptions.filterOptions.filterText = $scope.gridOptions.filterOptions.filterText.replace(oldsearchText, "");
            }
            else{
                $scope.myfilter.field = "city";
                $scope.myfilter.value = searchText.trim();
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }

        }
    });

    $scope.$watch('gridOptions.filterOptions.filterTextEmail', function(searchText, oldsearchText) {
        if (searchText !== oldsearchText) {
            if(searchText == ""){
                $scope.myfilter.field = "email";
                $scope.myfilter.value = "";
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                //$scope.gridOptions.filterOptions.filterText = $scope.gridOptions.filterOptions.filterText.replace(oldsearchText, "");
            }
            else{
                $scope.myfilter.field = "email";
                $scope.myfilter.value = searchText.trim();
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }

        }
    });

    /*
     $scope.$watch('gridOptions.filterOptions.filterTextName', function(searchText, oldsearchText) {
     if (searchText !== oldsearchText) {
     if(searchText == "")
     $scope.gridOptions.filterOptions.filterText = $scope.gridOptions.filterOptions.filterText.replace(oldsearchText, "");
     else if(oldsearchText != "")
     $scope.gridOptions.filterOptions.filterText = $scope.gridOptions.filterOptions.filterText.replace(oldsearchText, searchText);
     else
     $scope.gridOptions.filterOptions.filterText += "name:" + searchText + "; ";
     }
     });
    * */
}